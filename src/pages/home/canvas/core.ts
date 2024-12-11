import * as THREE from 'three';
import { Subject } from 'rxjs';
import { CAMERA_ROTATION_Y } from '@/pages/home/canvas/constants';
import { Color } from 'three';

export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 180, 500);

camera.rotation.y = THREE.MathUtils.degToRad(-CAMERA_ROTATION_Y);

export const SwitchSubject = new Subject();

export const AnimationFrameSubject = new Subject();

export const points = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 1 }));
scene.add(points);

const TestBox = new THREE.Mesh(
  new THREE.BoxGeometry(10, 10, 10),
  new THREE.MeshBasicMaterial({
    color: '#0de8c9',
  })
);

scene.add(TestBox);

const planeGeometry = new THREE.PlaneGeometry(
  window.innerWidth * 1.2,
  window.innerHeight,
  window.innerWidth / 15,
  window.innerHeight / 15
);

// const;

export const backgroundMesh = new THREE.Mesh(
  planeGeometry,
  new THREE.MeshBasicMaterial({
    // color: '#1e1a25',
    color: new Color(0x1e1a25),

    // wireframe: true,
  })
);
backgroundMesh.position.y = 180;
backgroundMesh.position.z = -300;

scene.add(backgroundMesh);

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
