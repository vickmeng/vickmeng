import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConfigMap } from '@/pages/canvas/config';
import { Subject } from 'rxjs';

// 创建场景
export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

export const AnimationFrameSubject = new Subject<unknown>();

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

//
// // 创建网格
const currentModelMesh = firstConfig.mesh;
currentModelMesh.position.set(firstConfig.position.x, firstConfig.position.y, firstConfig.position.z);

scene.add(currentModelMesh);

/**
 * 创建第一个场景 end
 */

AnimationFrameSubject.asObservable().subscribe(() => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(() => {
    AnimationFrameSubject.next(undefined);
  });
});

AnimationFrameSubject.next(undefined);
