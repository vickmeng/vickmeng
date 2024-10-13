import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConfigList, handleCalculateConfigList } from './config';
import { Subject } from 'rxjs';
import { MeshBasicMaterial } from 'three';

// 创建场景
export const scene = new THREE.Scene();
export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100000);

export const AnimationFrameSubject = new Subject<number>();

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
camera.position.set(0, 0, 3000);

/**
 * 创建points start
 * 暂时不显示点
 */
// const firstConfig = ConfigList['1'];
//
const pointsGeometry = new THREE.BufferGeometry();
const pointsMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 1 });

export const points = new THREE.Points(pointsGeometry, pointsMaterial);

scene.add(points);
/**
 * 创建points end
 */
//
// //
// // // 创建网格
// const currentModelMesh = firstConfig.mesh;
// currentModelMesh.position.set(firstConfig.position.x, firstConfig.position.y, firstConfig.position.z);
// scene.add(currentModelMesh);

//
/**
 * 创建第一个场景 end
 */

/**
 * 一次创建所有场景 start
 */
ConfigList.forEach((_config, _index) => {
  const { mesh, position } = _config;
  mesh.position.set(position.x, position.y, position.z);

  if (_index !== 0) {
    (mesh.material as MeshBasicMaterial).opacity = 0;
  }

  // 测试贝塞尔

  scene.add(mesh);
});
/**
 * 一次创建所有场景 end
 */

/**
 *  计算所有点位以及贝塞尔曲线 start
 */
handleCalculateConfigList(scene);

/**
 *  计算所有点位以及贝塞尔曲线 end
 */

AnimationFrameSubject.asObservable().subscribe(() => {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame((time) => {
    AnimationFrameSubject.next(time);
  });
});

requestAnimationFrame((time) => {
  AnimationFrameSubject.next(time);
});
