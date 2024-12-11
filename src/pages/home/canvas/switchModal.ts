import { ConfigList } from '@/pages/home/canvas/config';
import * as THREE from 'three';
import { Color, MeshBasicMaterial } from 'three';

import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { Easing, Tween } from '@tweenjs/tween.js';
import { AnimationFrameSubject, camera, points, scene, SwitchSubject } from '@/pages/home/canvas/core';
import { CAMERA_ROTATION_Y, SANDS_COUNT, SANDS_FLY_BATCH_COUNT } from '@/pages/home/canvas/constants';
import { Config } from '@/pages/home/canvas/types';

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
export const switchModal = async (opts: Options) => {
  SwitchSubject.next(undefined);

  const { fromIndex, toIndex } = opts;

  const fromConfig = ConfigList[fromIndex];
  const toConfig = ConfigList[toIndex];

  if (fromConfig.onSwitchOut) {
    await fromConfig.onSwitchOut({ fromConfig, toConfig });
  }

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
   * 沙子飞 start
   */
  await Promise.all([
    sandsFly({ fromIndex, toIndex, fromConfig, toConfig }),
    changeColor({ fromIndex, toIndex, fromConfig, toConfig }),
    cameraRoll({ fromIndex }),
    showModal({ toConfig }),
  ]);
  /**
   * sandsFly end
   */
  // const toMesh = toConfig.mesh;

  // (toMesh.material as MeshBasicMaterial).opacity = 1;

  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));

  if (toConfig.onSwitchIn) {
    await toConfig.onSwitchIn({ fromConfig, toConfig });
  }
};

const sandsFly = async (params: { fromIndex: number; toIndex: number; fromConfig: Config; toConfig: Config }) => {
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
        .to({ t: toNext ? 1 : 0 }, 3000 + currentIndex * 20)
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

const cameraRoll = async (params: { fromIndex: number }) => {
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const leftToRight = params.fromIndex % 2 === 0;

  const moveParams = { deg: leftToRight ? -CAMERA_ROTATION_Y : CAMERA_ROTATION_Y };

  const tween = new Tween(moveParams)
    .to({ deg: leftToRight ? CAMERA_ROTATION_Y : -CAMERA_ROTATION_Y }, 4000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      camera.rotation.y = THREE.MathUtils.degToRad(moveParams.deg);
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

const changeColor = async (params: { fromIndex: number; toIndex: number; fromConfig: Config; toConfig: Config }) => {
  const { fromConfig, toConfig } = params;
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const alphaParams = { alpha: 0 };

  const tween = new Tween(alphaParams)
    .to({ alpha: 1 }, 5000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      const newPreColor = new Color();
      newPreColor.lerpColors(fromConfig.preColor, toConfig.preColor, alphaParams.alpha);

      points.material.color = newPreColor;
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start(); // Start the tween immediately.;

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

const showModal = async (params: { toConfig: Config }) => {
  const { toConfig } = params;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const opacityParams = { opacity: 0 };

  const toLine = toConfig.line;

  const tween = new Tween(opacityParams)
    .delay(3000)
    .to({ opacity: 1 }, 2000)
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
