import * as THREE from 'three';
import { Subject } from 'rxjs';
import { CAMERA_ROTATION_Y } from '@/pages/home/canvas/constants';

export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 180, 500);

camera.rotation.y = THREE.MathUtils.degToRad(-CAMERA_ROTATION_Y);

export const SwitchSubject = new Subject();

export const AnimationFrameSubject = new Subject();

export const points = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 1 }));

const TestBox = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({
    color: '#0de8c9',
  })
);

scene.add(TestBox);

const planeGeometry = new THREE.PlaneGeometry(8000, 8000, 10, 10);
export const backgroundMesh = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshBasicMaterial({
    color: '#0de8c9',
    wireframe: true,
  })
);
backgroundMesh.position.z = -1500;

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
