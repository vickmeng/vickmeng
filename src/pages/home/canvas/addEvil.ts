import evil from '@/assets/evil.fbx?url';

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/home/canvas/core';
import { Group, Mesh, MeshPhongMaterial } from 'three';

export const addEvil = async () => {
  const loader = new FBXLoader();

  const model: Group = await loader.loadAsync(evil);

  // @ts-ignore
  model.children.forEach((child: Mesh) => {
    child.material = new MeshPhongMaterial({
      color: 0xffffff,
      specular: 0xffffff, // 高光颜色设为白色
      shininess: 100, // 增加高光光泽度
    });
    child.receiveShadow = true;
    child.castShadow = true;
  });

  model.rotation.set(0, Math.PI / 2, 0);
  model.position.z = -25;
  scene.add(model);
};
