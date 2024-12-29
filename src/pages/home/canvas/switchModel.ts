import * as THREE from 'three';
import { Color, Euler, Group, Mesh, MeshBasicMaterial, PointsMaterial, ShaderMaterial } from 'three';

import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { Easing, Tween } from '@tweenjs/tween.js';
import { AnimationFrameSubject, camera, earthGroup, mouse, points, scene } from '@/pages/home/canvas/core';
import {
  EARTH_POSITION_X,
  MOUSE_ROLL_CAMERA_SPEED_X,
  MOUSE_ROLL_CAMERA_SPEED_Y,
  SANDS_COUNT,
  SANDS_FLY_BATCH_COUNT,
} from '@/pages/home/canvas/constants';
import { CityConfig } from '@/pages/home/canvas/types';
import { CityConfigList } from '@/pages/home/canvas/cityConfig';
import { switchModelProcessStore } from '@/pages/home/store';

interface Options {
  fromIndex: number;
  toIndex: number;
  onFinish?: () => void;
}

/**
 * switchModal
 * 切换模型
 * 仅支持上一个下一个，不能跨
 */
export const switchModel = async (opts: Options) => {
  const { fromIndex, toIndex } = opts;

  const fromConfig = CityConfigList[fromIndex];
  const toConfig = CityConfigList[toIndex];

  /**
   * 取消包围与手势 start
   */
  // outlinePass.enabled = false; // 初始设为禁用
  // outlinePass.selectedObjects = [];

  const page = document.querySelector('#timeline-page') as HTMLDivElement;
  page.classList.remove('pointer');

  /**
   * 取消包围 start
   */
  /**
   * 生成沙子 start
   */

  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(fromConfig.pointVertices, 3));

  /**
   * 生成沙子 end
   */

  /**
   * 网格消失
   */

  // 直接干掉比缓动效果反倒好一些
  const fromLine = fromConfig.line;

  (fromLine.material as MeshBasicMaterial).opacity = 0;
  /**
   * 网格消失 出现
   */

  /**
   * 沙子出现 start
   */
  (points.material as PointsMaterial).opacity = 1;
  /**
   * 沙子出现 end
   */

  /**
   * 移除desc start
   */
  const desc = scene.children.find((child) => child.name === 'desc') as Group;
  scene.remove(desc);

  /**
   * 移除desc end
   */

  /**
   * 动画 start
   */
  await Promise.all([
    switchProcess({ fromIndex, toIndex, fromConfig, toConfig }),
    sandsFly({ fromIndex, toIndex, fromConfig, toConfig }),
    changeColor({ fromIndex, toIndex, fromConfig, toConfig }),
    cameraRoll({ fromIndex, toIndex, fromConfig, toConfig }),
    earthMove({ fromIndex }),
    earthRoute({ fromIndex, toIndex, fromConfig, toConfig }),
    // sunMove({ fromIndex }),
    showModal({ toConfig }),
    flyLine({ fromIndex, toIndex, fromConfig, toConfig }),
    hideSands(),
  ]);
  /**
   * 动画 end
   */
  scene.add(toConfig.getDesc());

  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));

  switchModelProcessStore.process = null;
};

const sandsFly = async (params: {
  fromIndex: number;
  toIndex: number;
  fromConfig: CityConfig;
  toConfig: CityConfig;
}) => {
  const { fromConfig, toConfig, fromIndex, toIndex } = params;

  const toNext = fromIndex < toIndex;
  // debugger;
  const curves = toNext ? fromConfig.toNextCurves : toConfig.toNextCurves;

  const position = points.geometry.attributes.position;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const batchSandsCount = SANDS_COUNT / SANDS_FLY_BATCH_COUNT;

  const tweenList: Tween[] = Array(SANDS_FLY_BATCH_COUNT)
    .fill(null)
    .reduce((previousValue, currentValue, currentIndex) => {
      const moveParams = { t: toNext ? 0 : 1 };

      const tween = new Tween(moveParams)
        .to({ t: toNext ? 1 : 0 }, 2000 + currentIndex * 20)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          const _t = moveParams.t;

          position.needsUpdate = true;
          for (let i = currentIndex * batchSandsCount; i < (currentIndex + 1) * batchSandsCount; i++) {
            // 如果是返回，则采用上一个的曲线
            const curve = curves[i];
            const newPosition = curve.getPoint(_t);

            position.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
          }
        })
        .onComplete(() => {
          if (currentIndex === batchSandsCount - 1) {
            // 最后一批完成
            animateFinish.next(undefined);
          }
        })
        .start(); // Start the tween immediately.

      previousValue.push(tween);
      return previousValue;
    }, []);

  animate$.subscribe({
    next: () => {
      tweenList.forEach((_tween) => {
        _tween.update();
      });
    },
    complete: () => {
      // 这个应该不需要了吧
      // tweenList.forEach((_tween) => {
      //   _tween.stop();
      // });
    },
  });
  await lastValueFrom(animate$);
};

const cameraRoll = async (params: {
  fromIndex: number;
  toIndex: number;
  fromConfig: CityConfig;
  toConfig: CityConfig;
}) => {
  const { toConfig } = params;
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const rollParams = { t: 0 };

  const fromRotation = camera.rotation;
  // 要考虑当前鼠标位置，鼠标位置会控制相机角度
  const toRotation = new Euler(
    toConfig.cameraRotation.x + mouse.y * MOUSE_ROLL_CAMERA_SPEED_X,
    toConfig.cameraRotation.y - mouse.x * MOUSE_ROLL_CAMERA_SPEED_Y,
    toConfig.cameraRotation.z
  );

  const fromQuaternion = new THREE.Quaternion().setFromEuler(fromRotation);
  const toQuaternion = new THREE.Quaternion().setFromEuler(toRotation);

  const tween = new Tween(rollParams)
    .to({ t: 1 }, 4000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      const interpolatedQuaternion = fromQuaternion.clone().slerp(toQuaternion, rollParams.t);
      camera.rotation.setFromQuaternion(interpolatedQuaternion);
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start(); // Start the tween immediately.

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });
  await lastValueFrom(animate$);
};
/**
 * 各种颜色都在这处理了
 *
 */
const changeColor = async (params: {
  fromIndex: number;
  toIndex: number;
  fromConfig: CityConfig;
  toConfig: CityConfig;
}) => {
  const { fromConfig, toConfig } = params;
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const alphaParams = { alpha: 0 };

  const tween = new Tween(alphaParams)
    .to({ alpha: 1 }, 4000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      const newPreColor = new Color();
      newPreColor.lerpColors(fromConfig.preColor, toConfig.preColor, alphaParams.alpha);

      points.material.color = newPreColor;

      earthGroup.children.forEach((child) => {
        if (child.name === 'cityHighLight') {
          const cityMark = child as Mesh;
          (cityMark.material as ShaderMaterial).uniforms.color.value = newPreColor;
        }
        if (child.name === 'cityPoint') {
          const cityMark = child as Mesh;
          (cityMark.material as MeshBasicMaterial).color = newPreColor;
        }

        if (child.name === 'flyLine') {
          const flyLine = child as Mesh;
          (flyLine.material as ShaderMaterial).uniforms.color.value = newPreColor;
        }
      });
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start();

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });
  await lastValueFrom(animate$);
};

const showModal = async (params: { toConfig: CityConfig }) => {
  const { toConfig } = params;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const opacityParams = { opacity: 0 };

  const toLine = toConfig.line;

  const tween = new Tween(opacityParams)
    .delay(3000)
    .to({ opacity: 1 }, 1000)
    .onUpdate(() => {
      (toLine.material as MeshBasicMaterial).opacity = opacityParams.opacity;
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start(); // Start the tween immediately.

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });

  await lastValueFrom(animate$);
};

const hideSands = async () => {
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const opacityParams = { opacity: 1 };

  const tween = new Tween(opacityParams)
    .delay(3000)
    .to({ opacity: 0 }, 1000)
    .onUpdate(() => {
      (points.material as PointsMaterial).opacity = opacityParams.opacity;
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start(); // Start the tween immediately.

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });

  await lastValueFrom(animate$);
};

const earthMove = async (params: { fromIndex: number }) => {
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const leftToRight = params.fromIndex % 2 === 0;

  const moveParams = { x: leftToRight ? EARTH_POSITION_X : -EARTH_POSITION_X };

  const tween = new Tween(moveParams)
    .to({ x: leftToRight ? -EARTH_POSITION_X : EARTH_POSITION_X }, 4000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      // earthGroup..y = THREE.MathUtils.degToRad(moveParams.deg);
      earthGroup.position.x = moveParams.x;
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start(); // Start the tween immediately.

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });
  await lastValueFrom(animate$);
};

const earthRoute = async (params: {
  fromIndex: number;
  toIndex: number;
  fromConfig: CityConfig;
  toConfig: CityConfig;
}) => {
  const { fromConfig, toConfig } = params;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const routeParams = { t: 0 };

  const formRotation = fromConfig.earthRotation;
  const toRotation = toConfig.earthRotation;

  const diffX = toRotation.x - formRotation.x;
  const diffY = toRotation.y - formRotation.y;
  const diffZ = toRotation.z - formRotation.z;

  const tween = new Tween(routeParams)
    .to({ t: 1 }, 4000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      const newX = formRotation.x + routeParams.t * diffX;
      const newY = formRotation.y + routeParams.t * diffY;
      const newZ = formRotation.z + routeParams.t * diffZ;

      earthGroup.rotation.set(newX, newY, newZ);
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start(); // Start the tween immediately.

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });
  await lastValueFrom(animate$);
};

const flyLine = async (params: {
  fromIndex: number;
  toIndex: number;
  fromConfig: CityConfig;
  toConfig: CityConfig;
}) => {
  const { fromConfig, toConfig, fromIndex, toIndex } = params;
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const toNext = params.toIndex > params.fromIndex;

  const flyLines = earthGroup.children.filter((child) => {
    return child.name === (toNext ? 'toNextFlyLine' : 'toPreFlyLine');
  });
  const activeFlyLine = flyLines[toNext ? fromIndex : toIndex] as Mesh;
  activeFlyLine.visible = true;
  const material = activeFlyLine.material as ShaderMaterial;

  const flyParams = { t: 0 };

  const tween = new Tween(flyParams)
    .to({ t: 1 }, 2000)
    .onUpdate(() => {
      const newPreColor = new Color();
      newPreColor.lerpColors(fromConfig.preColor, toConfig.preColor, flyParams.t);
      material.uniforms.color.value = newPreColor;
      material.uniforms.x.value = flyParams.t;
    })
    .onComplete(() => {
      activeFlyLine.visible = false;
      animateFinish.next(undefined);
    })
    .start();

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });

  await lastValueFrom(animate$);
};

// const sunMove = async (params: { fromIndex: number }) => {
//   const animateFinish = new Subject();
//
//   const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));
//
//   const leftToRight = params.fromIndex % 2 === 0;
//
//   const moveParams = { x: leftToRight ? SUN_POSITION_X : -SUN_POSITION_X };
//
//   const tween = new Tween(moveParams)
//     .to({ x: leftToRight ? -SUN_POSITION_X : SUN_POSITION_X }, 4000)
//     .easing(Easing.Cubic.Out)
//     .onUpdate(() => {
//       sun.position.x = moveParams.x;
//       // 以免旋转的时候把sun搞没了，y抬高一点点，约x是0时候y抬高1
//       const upY = (Math.abs(SUN_POSITION_X) - Math.abs(moveParams.x)) / 10;
//       sun.position.y = SUN_POSITION_Y + upY;
//     })
//     .onComplete(() => {
//       animateFinish.next(undefined);
//     })
//     .start(); // Start the tween immediately.
//
//   animate$.subscribe({
//     next: () => {
//       tween.update();
//     },
//     complete: () => {
//       tween.stop();
//     },
//   });
//   await lastValueFrom(animate$);
// };

/**
 * switchProcess
 * 🐧换动画的进度
 */
const switchProcess = async (params: {
  fromIndex: number;
  toIndex: number;
  fromConfig: CityConfig;
  toConfig: CityConfig;
}) => {
  const { fromIndex, toIndex } = params;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const routeParams = { t: 0 };
  const tween = new Tween(routeParams)
    .to({ t: 100 }, 4000)
    .onUpdate(() => {
      switchModelProcessStore.process = {
        value: routeParams.t,
        fromIndex,
        toIndex,
      };
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start(); // Start the tween immediately.

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });
  await lastValueFrom(animate$);
};
