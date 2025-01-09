import { MathUtils, Mesh, MeshStandardMaterial, PlaneGeometry, SphereGeometry } from 'three';
import { scene } from '@/pages/home/canvas/core';

export const addBackground = () => {
  const groundGeometry = new PlaneGeometry(2000, 2000);
  groundGeometry.rotateX(-0.5 * Math.PI);
  const groundMaterial = new MeshStandardMaterial({ color: 0xcccccc });
  const ground = new Mesh(groundGeometry, groundMaterial);
  scene.add(ground);
  ground.receiveShadow = true;
  ground.castShadow = true;
  // const geometry = new PlaneGeometry(2000, 2000, 200, 200);
  // const positionAttribute = geometry.getAttribute('position');
  // const noiseScale = 1.5;
  // for (let i = 0; i < positionAttribute.count; i++) {
  //   const x = positionAttribute.getX(i);
  //   const y = positionAttribute.getY(i);
  //   const baseNoiseValue = MathUtils.seededRandom((x + y) * noiseScale);
  //
  //   positionAttribute.setZ(i, baseNoiseValue * 5);
  // }
  // positionAttribute.needsUpdate = true;
  // const material = new MeshStandardMaterial({ color: 0xcccccc });
  //
  // const terrain = new Mesh(geometry, material);
  // terrain.receiveShadow = true;
  // terrain.castShadow = true;
  //
  // terrain.rotateX(-0.5 * Math.PI);
  //
  // scene.add(terrain);

  const ball = new Mesh(new SphereGeometry(100, 100), new MeshStandardMaterial({ color: 0xcccccc }));
  ball.receiveShadow = true;
  ball.castShadow = true;

  scene.add(ball);
};
