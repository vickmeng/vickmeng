/**
 *  计算所有点位以及贝塞尔曲线 end
 */
import * as THREE from 'three';
import { MeshBasicMaterial, SphereGeometry } from 'three';
// @ts-ignore
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConfigList, handleCalculateConfigList } from './config';
import { AnimationFrameSubject, camera, points, renderer, scene } from '@/pages/canvas/core';

// 创建场景

// 创建渲染器
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
// document.body.appendChild(renderer.domElement);

// export const controls = new OrbitControls(camera, renderer.domElement);
// controls.update();

/**
 * add points start
 * 暂时不显示点
 */

scene.add(points);
/**
 * add points end
 */

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

  scene.add(mesh);
});

// 这只是个标记
const testMesh = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
testMesh.position.set(0, 0, 0);
scene.add(testMesh);

/**
 * 一次创建所有场景 end
 */

/**
 *  计算所有点位以及贝塞尔曲线 start
 */
handleCalculateConfigList(scene);

AnimationFrameSubject.asObservable().subscribe(() => {
  renderer.render(scene, camera);
  // controls.update();
  requestIdleCallback(() => {
    AnimationFrameSubject.next(undefined);
  });
});

requestIdleCallback(() => {
  AnimationFrameSubject.next(undefined);
});
