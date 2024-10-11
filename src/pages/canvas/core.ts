import * as THREE from 'three';
import { getVerticesFromMesh } from '@/pages/canvas/utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConfigMap } from '@/pages/canvas/config';

// 创建场景
export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

controls.update();
camera.position.set(0, 20, 800);

/**
 * 创建第一个场景 start
 */
const firstConfig = ConfigMap['1'];

const pointsGeometry = new THREE.BufferGeometry();
const pointsMaterial = new THREE.PointsMaterial({ color: 0xff0000, size: 1 });
export const points = new THREE.Points(pointsGeometry, pointsMaterial);

scene.add(points);

//
// // 创建网格
const currentModelMesh = firstConfig.mesh;
currentModelMesh.position.set(firstConfig.position.x, firstConfig.position.y, firstConfig.position.z);

scene.add(currentModelMesh);

// const vertices = getVerticesFromMesh({ mesh: currentModelMesh, position: firstConfig.position });
//
// const position = new THREE.Float32BufferAttribute(vertices, 3);
// position.needsUpdate = true;
//
// pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

// points.geometry.attributes.position.needsUpdate = true;
/**
 * 创建第一个场景 end
 */

// 动画循环
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();

  // if (points.geometry.attributes.position) {
  //   // const { position } = points.geometry.attributes;
  //   points.geometry.attributes.position.needsUpdate = true;
  // }

  //
  // for (let i = 0; i < position.count; i++) {
  //   const px = position.getX(i);
  //   const py = position.getY(i);
  //   const pz = position.getZ(i);
  //
  //   const delta = clock.getDelta();
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
}

animate();
