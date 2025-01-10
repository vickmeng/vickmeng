import { Mesh, MeshStandardMaterial, CircleGeometry } from 'three';
import { scene } from '@/pages/home/canvas/core';

export const addBackground = async () => {
  const groundGeometry = new CircleGeometry(80, 32);
  groundGeometry.rotateX(-0.5 * Math.PI);
  const groundMaterial = new MeshStandardMaterial({ color: 0xeeeeee });
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.receiveShadow = true;
  ground.castShadow = true;
  scene.add(ground);
};
