import { Config, ConfigMap } from '@/pages/canvas/config';
import * as THREE from 'three';
import { AnimationFrameSubject, clock, points, scene } from '@/pages/canvas/core';
import { getVerticesFromMesh } from '@/pages/canvas/utils';
import { lastValueFrom, Subject, take, takeUntil } from 'rxjs';
import { Tween, Easing } from '@tweenjs/tween.js';
import { MeshBasicMaterial } from 'three';

interface Options {
  currentId: string;
  targetId: string;
  onFinish?: () => void;
}

export const switchToOther = async (opts: Options) => {
  const { currentId, targetId } = opts;

  const currentConfig = ConfigMap[currentId];
  const targetConfig = ConfigMap[targetId];
  // // 创建target网格
  const targetModelMesh = targetConfig.mesh;
  targetModelMesh.position.set(targetConfig.position.x, targetConfig.position.y, targetConfig.position.z);
  scene.add(targetModelMesh);
  /**
   * 生成沙子 start
   */
  const vertices = getVerticesFromMesh({ mesh: currentConfig.mesh, position: currentConfig.position });

  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

  /**
   * 生成沙子 end
   */

  /**
   * 网格消失
   */
  // 直接干掉比缓动效果反倒好一些
  const mesh = currentConfig.mesh;
  scene.remove(mesh);
  // (mesh.material as MeshBasicMaterial).opacity = 0;
  /**
   * 网格消失 出现
   */

  /**
   * 让当前点四散 start
   */

  await sandsFly({ currentConfig });

  // await sandsFly({ currentConfig });

  /**
   * 让当前点四散 end
   */
};

// 沙子散开，物体隐藏
const sandsFly = async (params: { currentConfig: Config }) => {
  const { currentConfig } = params;

  const position = points.geometry.attributes.position;

  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const moveParams = { speed: 4 };

  const tween = new Tween(moveParams) // Create a new tween that modifies 'coords'.
    .to({ speed: 0 }, 1200) // Move to (300, 200) in 1 second.
    .easing(Easing.Cubic.Out) // Use an easing function to make the animation smooth.
    .onUpdate(() => {
      const delta = clock.getDelta();
      const scalar = 300 * delta * moveParams.speed; // 在不同帧率保持速度

      position.needsUpdate = true;
      for (let i = 0; i < position.count; i++) {
        const originalPosition = new THREE.Vector3().fromBufferAttribute(position, i);
        // 归一化方向
        const directionNormalized = originalPosition.clone().sub(currentConfig.position).normalize();

        const randomFactor = Math.random() - 0.5;

        directionNormalized.x += randomFactor;
        directionNormalized.y += randomFactor;
        directionNormalized.z += randomFactor;

        let newPosition = originalPosition.clone().add(directionNormalized.multiplyScalar(scalar)); // 0.1 是缩放因子，可以根据需要调整

        const originalDistanceToCenter = originalPosition.distanceTo(currentConfig.position);
        const newDistanceToCenter = newPosition.distanceTo(currentConfig.position);

        if (newDistanceToCenter < originalDistanceToCenter) {
          // 如果方向反转了
          directionNormalized.x -= randomFactor;
          directionNormalized.y -= randomFactor;
          directionNormalized.z -= randomFactor;

          newPosition = originalPosition.clone().add(directionNormalized.multiplyScalar(scalar)); // 0.1 是缩放因子，可以根据需要调整
        }

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
