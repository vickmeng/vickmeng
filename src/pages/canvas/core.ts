import * as THREE from 'three';
import { Subject } from 'rxjs';
import { MODEL_COLOR } from '@/pages/canvas/constants';
import { Color } from 'three';

export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

scene.background = new Color(0x1c1c1c);

// 创建相机
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 480, 1000);

camera.rotation.y = THREE.MathUtils.degToRad(10);

export const SwitchSubject = new Subject();

export const AnimationFrameSubject = new Subject();

export const points = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ color: MODEL_COLOR, size: 1 })
);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
