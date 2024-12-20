import * as THREE from 'three';
import { Color } from 'three';
import { Subject } from 'rxjs';
import { CAMERA_ROTATION_Y, SCENE_BACKGROUND_COLOR } from '@/pages/home/canvas/constants';
import { createEarth } from '@/pages/home/canvas/createEarth';

export const AnimationFrameSubject = new Subject();

export const scene = new THREE.Scene();
scene.background = new Color(SCENE_BACKGROUND_COLOR);

export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(0, 180, 500);

camera.rotation.y = THREE.MathUtils.degToRad(CAMERA_ROTATION_Y);

export const points = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ size: 1, transparent: true })
);
scene.add(points);

export const earthGroup = await createEarth();

scene.add(earthGroup);

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFShadowMap;
// console.log('document.querySelector', document.querySelector('#timeline-page'));

// document.body.appendChild(renderer.domElement);
