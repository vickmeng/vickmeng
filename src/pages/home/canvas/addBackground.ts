import { Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, PlaneGeometry, SphereGeometry } from 'three';
import { scene } from '@/pages/home/canvas/core';

export const addBackground = async () => {
  const groundGeometry = new PlaneGeometry(80, 80);
  groundGeometry.rotateX(-0.5 * Math.PI);
  const groundMaterial = new MeshStandardMaterial({ color: 0xcccccc });
  const ground = new Mesh(groundGeometry, groundMaterial);
  ground.receiveShadow = true;
  ground.castShadow = true;
  scene.add(ground);

  // const ball = new Mesh(new SphereGeometry(10, 10), new MeshPhongMaterial({ color: 0xff0000 }));
  // ball.receiveShadow = true;
  // ball.castShadow = true;
  // scene.add(ball);
};
