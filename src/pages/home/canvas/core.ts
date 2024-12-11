import * as THREE from 'three';
import { Subject } from 'rxjs';
import { CAMERA_ROTATION_Y } from '@/pages/home/canvas/constants';
import { Color } from 'three';
import { randomBackgroundGeometry } from '@/pages/home/canvas/utils/randomBackgroundGeometry';

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

const PlaneGeometry = new THREE.PlaneGeometry(100, 100, 1, 1);

const originVertices = PlaneGeometry.getAttribute('position').array as Float32Array;

const originPoints = []; // 没三个值为一个点，分成组
for (let i = 0; i < originVertices.length; i += 3) {
  const group = [originVertices[i], originVertices[i + 1], originVertices[i + 2]];
  originPoints.push(group);
}

// randomBackgroundGeometry();

export const backgroundMesh = new THREE.Mesh(
  randomBackgroundGeometry(),
  new THREE.MeshBasicMaterial({
    color: new Color(0x1e1a25),
    // color: new Color(0xff0000),
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
