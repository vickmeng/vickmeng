import { ConfigMap } from '@/pages/canvas/config';
import * as THREE from 'three';
import { points, scene } from '@/pages/canvas/core';
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

  const position = new THREE.Float32BufferAttribute(vertices, 3);
  position.needsUpdate = true;
  points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  /**
   * 让当前点 end
   */
  /**
   * 让当前点四散 start
   */
  // for (let i = 0; i < position.count; i++) {
  //   const px = position.getX(i);
  //   const py = position.getY(i);
  //   const pz = position.getZ(i);
  //
  //   // const delta = clock.getDelta();
  //
  //   // position.setXYZ(
  //   //   i,
  //   //   px + getRandomNumberFormZeroToOne() * delta * 999999,
  //   //   py + getRandomNumberFormZeroToOne() * delta * 999999,
  //   //   pz + getRandomNumberFormZeroToOne() * delta * 999999
  //   // );
  //
  //   position.setXYZ(i, px + 1, py + 1, pz + 1);
  // }

  /**
   * 让当前点四散 end
   */
};
