import { Config, ConfigList } from '@/pages/canvas/config';
import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';
import { AnimationFrameSubject, points } from '@/pages/canvas/core';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { Easing, Tween } from '@tweenjs/tween.js';

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
  // scene.remove(mesh);
  (fromMesh.material as MeshBasicMaterial).opacity = 0;
  /**
   * 网格消失 出现
   */

  /**
   * 沙子飞 start
   */
  await sandsFly({ fromConfig, toConfig });

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
  // const curve = fromConfig.toNextCurves[0];

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const moveParams = { t: 0 };

  const tween = new Tween(moveParams)
    .to({ t: 1 }, 3000)
    .easing(Easing.Cubic.Out)
    .onUpdate(() => {
      const _t = moveParams.t;
      position.needsUpdate = true;
      for (let i = 0; i < position.count; i++) {
        const curve = fromConfig.toNextCurves[i];
        const newPosition = curve.getPoint(_t);

        position.setXYZ(i, newPosition.x, newPosition.y, newPosition.z);
      }
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
