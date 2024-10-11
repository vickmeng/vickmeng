import { ConfigMap } from '@/pages/config';
import * as THREE from 'three';
import { scene, points } from '@/pages/core';
import { getVerticesFromMesh } from '@/pages/utils';

interface Options {
  currentId: string;
  targetId: string;
  onFinish: () => void;
}

const SwitchToOther = (opts: Options) => {
  const { currentId, targetId } = opts;

  const currentConfig = ConfigMap[currentId];
  const targetConfig = ConfigMap[targetId];

  const targetModelGeometry = targetConfig.mesh;
  const targetModelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

  // // 创建target网格
  const targetModelMesh = new THREE.Mesh(targetModelGeometry, targetModelMaterial);
  targetModelMesh.position.set(targetConfig.position.x, targetConfig.position.y, targetConfig.position.z);
  scene.add(targetModelMesh);

  // const vertices = getVerticesFromMesh(currentConfig.model);

  const { position } = points.geometry.attributes;

  /**
   * 让当前点出现并四散
   */
};
