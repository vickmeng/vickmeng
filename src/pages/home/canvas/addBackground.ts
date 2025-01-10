import {
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  SphereGeometry,
  TextureLoader,
  Vector2,
} from 'three';
import { scene } from '@/pages/home/canvas/core';
import grass from '@/assets/grasslight-big.jpg';
import grassNM from '@/assets/grasslight-big-nm.jpg';

export const addBackground = async () => {
  const textureLoader = new TextureLoader();
  const grassColorTexture = textureLoader.load(grass);
  const grassNormalTexture = textureLoader.load(grassNM);

  const groundGeometry = new PlaneGeometry(2048, 2048);
  groundGeometry.rotateX(-0.5 * Math.PI);
  const groundMaterial = new MeshStandardMaterial({ color: 0xcccccc });

  // const groundMaterial = new MeshLambertMaterial({
  //   map: grassColorTexture,
  //   normalMap: grassNormalTexture,
  //   normalScale: new Vector2(0.2, 0.2), // 控制法线纹理的强度，可根据需要调整
  // });

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

  // const ball = new Mesh(new SphereGeometry(100, 100), new MeshStandardMaterial({ color: 0xcccccc }));
  // ball.receiveShadow = true;
  // ball.castShadow = true;

  // scene.add(ball);
};
