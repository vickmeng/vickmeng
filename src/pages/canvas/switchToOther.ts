import { ConfigMap } from '@/pages/canvas/config';
import * as THREE from 'three';
import { AnimationFrameSubject, clock, points, scene } from '@/pages/canvas/core';
import { getVerticesFromMesh } from '@/pages/canvas/utils';

interface Options {
  currentId: string;
  targetId: string;
  onFinish?: () => void;
}

export const switchToOther = (opts: Options) => {
  const { currentId, targetId } = opts;

  const currentConfig = ConfigMap[currentId];
  const targetConfig = ConfigMap[targetId];

  // const targetModelGeometry = targetConfig.mesh;
  // const targetModelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

  // // 创建target网格
  const targetModelMesh = targetConfig.mesh;
  targetModelMesh.position.set(targetConfig.position.x, targetConfig.position.y, targetConfig.position.z);
  scene.add(targetModelMesh);

  // const vertices = getVerticesFromMesh(currentConfig.model);

  // const { position } = points.geometry.attributes;

  /**
   * 让当前点 start
   */
  const vertices = getVerticesFromMesh({ mesh: currentConfig.mesh, position: currentConfig.position });

  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const position = points.geometry.attributes.position;
  // position.needsUpdate = true;
  /**
   * 让当前点 end
   */
  /**
   * 让当前点四散 start
   */

  AnimationFrameSubject.subscribe(() => {
    const delta = clock.getDelta();
    const scalar = 300 * delta; // 在不同帧率保持速度
    // console.log(delta);

    position.needsUpdate = true;
    for (let i = 0; i < position.count; i++) {
      const originalPosition = new THREE.Vector3().fromBufferAttribute(position, i);
      // 归一化方向
      const directionNormalized = originalPosition.clone().sub(currentConfig.position).normalize();

      const randomFactor = (Math.random() - 0.5) * 6;

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

      // originalPosition
    }
  });

  /**
   * 让当前点四散 end
   */
};
