import * as THREE from 'three';
import { getVerticesFromMesh } from '@/pages/utils';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConfigMap } from '@/pages/config';

// 创建场景
const scene = new THREE.Scene();
const clock = new THREE.Clock();

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

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
const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });
export const points = new THREE.Points(pointsGeometry, pointsMaterial);

scene.add(points);

// // 创建几何体和材质
const currentModelGeometry = firstConfig.model;
const currentModelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
//
// // 创建网格
const currentModelMesh = new THREE.Mesh(currentModelGeometry, currentModelMaterial);
currentModelMesh.position.set(firstConfig.position.x, firstConfig.position.y, firstConfig.position.z);

scene.add(currentModelMesh);

const vertices = getVerticesFromMesh(currentModelMesh);

pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
/**
 * 创建第一个场景 end
 */

// 动画循环
function animate() {
  requestAnimationFrame(animate);

  renderer.render(scene, camera);
  controls.update();
  const { position } = points.geometry.attributes;
  position.needsUpdate = true;

  for (let i = 0; i < position.count; i++) {
    const px = position.getX(i);
    const py = position.getY(i);
    const pz = position.getZ(i);

    const delta = clock.getDelta();

    // position.setXYZ(
    //   i,
    //   px + getRandomNumberFormZeroToOne() * delta * 999999,
    //   py + getRandomNumberFormZeroToOne() * delta * 999999,
    //   pz + getRandomNumberFormZeroToOne() * delta * 999999
    // );

    position.setXYZ(i, px + 1, py + 1, pz + 1);
  }
}

animate();
