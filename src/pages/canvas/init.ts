import * as THREE from 'three';
import { MeshBasicMaterial } from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ConfigList, handleCalculateConfigList } from './config';
import { AnimationFrameSubject, camera, points, scene } from '@/pages/canvas/core';

// 创建场景

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

export const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
camera.position.set(0, 0, 1000);

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
