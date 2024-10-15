import { Config, ConfigList } from '@/pages/canvas/config';
import * as THREE from 'three';
import { CatmullRomCurve3, MeshBasicMaterial } from 'three';

import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { Easing, Tween } from '@tweenjs/tween.js';
import { AnimationFrameSubject, camera, points, scene } from '@/pages/canvas/core';
import { SANDS_COUNT } from '@/pages/canvas/constants';

interface Options {
  fromIndex: number;
  toIndex: number;
  onFinish?: () => void;
}

export const switchToOther = async (opts: Options) => {
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
   * TODO 分批
   */
  await Promise.all([sandsFly({ fromConfig, toConfig })]);
  /**
   * sandsFly end
   */
  const toMesh = toConfig.mesh;

  (toMesh.material as MeshBasicMaterial).opacity = 1;

  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute([], 3));
};

const sandsFly = async (params: { fromConfig: Config; toConfig: Config }) => {
  const { fromConfig } = params;
  const position = points.geometry.attributes.position;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const batchCount = 100; // 一共100个批次

  const batchSandsCount = SANDS_COUNT / batchCount;

  const tweenList: Tween[] = Array(batchCount)
    .fill(null)
    .reduce((previousValue, currentValue, currentIndex) => {
      const moveParams = { t: 0 };

      const tween = new Tween(moveParams)
        .to({ t: 1 }, 3000 + currentIndex * 20)
        .easing(Easing.Cubic.Out)
        .onUpdate(() => {
          const _t = moveParams.t;
          position.needsUpdate = true;
          for (let i = currentIndex * batchSandsCount; i < (currentIndex + 1) * batchSandsCount; i++) {
            const curve = fromConfig.toNextCurves[i];
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

const cameraFollowSands = async (params: { fromConfig: Config; toConfig: Config }) => {
  const { fromConfig, toConfig } = params;

  const traceSandIndex = Math.floor(fromConfig.toNextCurves.length / 2);
  // 选择中间的一条贝塞尔曲线
  const sandCurve = fromConfig.toNextCurves[traceSandIndex];

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const moveParams = { t: 0 };

  const tween = new Tween(moveParams)
    .to({ t: 1 }, 3000)

    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      const _t = moveParams.t;
      camera.lookAt(sandCurve.getPoint(_t));
      //
      // // if (_t > 0.2) {
      // // }
      // if (_t < 0.9) {
      //   camera.position.copy(cameraCurve.getPoint(_t));
      // }
      // if (_t > 0.01) {
      //   // camera.lookAt(sandCurve.getPoint(_t - 0.01));
      // }
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
