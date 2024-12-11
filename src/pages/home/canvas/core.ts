import * as THREE from 'three';
import { Color } from 'three';
import { Subject } from 'rxjs';
import { CAMERA_ROTATION_Y } from '@/pages/home/canvas/constants';
import { randomBackgroundGeometry } from '@/pages/home/canvas/utils/randomBackgroundGeometry';
import { GUI } from 'dat.gui';

export const SwitchSubject = new Subject();

export const AnimationFrameSubject = new Subject();

export const scene = new THREE.Scene();
// export const clock = new THREE.Clock();

// 创建环境光
// const ambientLight = new THREE.AmbientLight(0xffffff);

// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 10000);
// pointLight.position.set(0, 180, 400);
// pointLight.castShadow = true;
// scene.add(pointLight);
// const lightHelper = new THREE.PointLightHelper(pointLight, 20);
// scene.add(lightHelper);

// export const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// directionalLight.position.set(0, 280, 500); // default; directionalLight shining from top
// directionalLight.castShadow = true; // default false
// scene.add(directionalLight);
// const lightHelper = new THREE.DirectionalLightHelper(directionalLight, 20);
// scene.add(lightHelper);
// directionalLight.target = new THREE.Vector3(0, 0, 0);
// directionalLight.shadow.mapSize.width = 1024;
// directionalLight.shadow.mapSize.height = 1024;
// directionalLight.shadow.near = 0.5;
// directionalLight.shadow.far = 5000;

// 创建相机
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 180, 500);

camera.rotation.y = THREE.MathUtils.degToRad(-CAMERA_ROTATION_Y);

export const points = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ size: 1 }));
scene.add(points);
/**
 *测试
 */
// export const TestBox = new THREE.Mesh(
//   new THREE.BoxGeometry(100, 100, 100),
//   new THREE.MeshPhongMaterial({
//     color: '#ffff00',
//   })
// );
// TestBox.position.set(0, 180, -300);
// TestBox.castShadow = true;
// TestBox.receiveShadow = true;
// TestBox.rotation.x = 1;
//
// // directionalLight.target = TestBox;
//
// scene.add(TestBox);
/**
 * 测试end
 */

export const backgroundMesh = new THREE.Mesh(
  randomBackgroundGeometry(),
  // new THREE.PlaneGeometry(500, 500),
  new THREE.MeshBasicMaterial({
    color: new Color(0x1e1a25),
    // color: new Color(0xffffff),
    wireframe: true,
  })
);

backgroundMesh.position.set(0, 180, -300);
backgroundMesh.castShadow = true;
backgroundMesh.receiveShadow = true;

scene.add(backgroundMesh);

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// renderer.shadowMap.type = THREE.PCFShadowMap;

document.body.appendChild(renderer.domElement);

// const gui = new GUI();
// // 为立方体的x、y、z位置添加控制器
// // const cubePosition = { x: 0, y: 0, z: 0 };
// gui.add(directionalLight.position, 'x', -500, 500).onChange((value) => {
//   directionalLight.position.x = value;
// });
// gui.add(directionalLight.position, 'y', -500, 500).onChange((value) => {
//   directionalLight.position.y = value;
// });
// gui.add(directionalLight.position, 'z', -500, 500).onChange((value) => {
//   directionalLight.position.z = value;
// });
//
// gui.add(directionalLight, 'intensity', 0, 1).onChange((value) => {
//   directionalLight.intensity = value;
// });
