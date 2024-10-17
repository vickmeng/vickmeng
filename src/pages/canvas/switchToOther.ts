import { Config, ConfigList } from '@/pages/canvas/config';
import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';

import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { Easing, Tween } from '@tweenjs/tween.js';
import { AnimationFrameSubject, camera, points, renderer, scene } from '@/pages/canvas/core';
import { SANDS_COUNT } from '@/pages/canvas/constants';

interface Options {
  fromIndex: number;
  toIndex: number;
  onFinish?: () => void;
}

export const switchToOther = async (opts: Options) => {
  console.log(opts);

  const { fromIndex, toIndex } = opts;

  const fromConfig = ConfigList[fromIndex];
  const toConfig = ConfigList[toIndex];

  // // 创建target网格
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
  const fromMesh = fromConfig.mesh;

  (fromMesh.material as MeshBasicMaterial).opacity = 0;
  /**
   * 网格消失 出现
   */

  /**
   * 沙子飞 start
   */
  await Promise.all([sandsFly({ fromIndex, toIndex, fromConfig, toConfig }), cameraRoll({ fromIndex })]);
  /**
   * sandsFly end
   */
  const toMesh = toConfig.mesh;

  (toMesh.material as MeshBasicMaterial).opacity = 1;

  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
};

const sandsFly = async (params: { fromIndex: number; toIndex: number; fromConfig: Config; toConfig: Config }) => {
  const { fromConfig, toConfig, fromIndex, toIndex } = params;

  const toNext = fromIndex < toIndex;
  // debugger;
  const curves = toNext ? fromConfig.toNextCurves : toConfig.toNextCurves;

  const position = points.geometry.attributes.position;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const batchCount = 100; // 一共100个批次

  const batchSandsCount = SANDS_COUNT / batchCount;

  const tweenList: Tween[] = Array(batchCount)
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

  const moveParams = { deg: leftToRight ? 10 : -10 };

  const tween = new Tween(moveParams)
    .to({ deg: leftToRight ? -10 : 10 }, 4000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      camera.rotation.y = THREE.MathUtils.degToRad(moveParams.deg);
      renderer.render(scene, camera);
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
