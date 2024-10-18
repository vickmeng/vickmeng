/**
 *  计算所有点位以及贝塞尔曲线 end
 */
import * as THREE from 'three';
import { MeshBasicMaterial, SphereGeometry } from 'three';
import { ConfigList, handleCalculateConfigList } from './config';
import { AnimationFrameSubject, camera, points, renderer, scene } from '@/pages/canvas/core';

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

await Promise.all(
  ConfigList.map(async (_config, _index) => {
    await _config.loadModal(_config);

    if (_index !== 0) {
      (_config.mesh.material as MeshBasicMaterial).opacity = 0;
    }
  })
);

// 这只是个标记
const testMesh = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
testMesh.position.set(0, 0, 0);
scene.add(testMesh);

const testMesh1 = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
testMesh1.position.set(-1000, 0, 0);
scene.add(testMesh1);

const testMesh2 = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
testMesh2.position.set(1000, 0, 0);
scene.add(testMesh2);

/**
 * 一次创建所有场景 end
 */

/**
 *  计算所有点位以及贝塞尔曲线 start
 */
handleCalculateConfigList();
// eslint-disable-next-line
console.log('ConfigList', ConfigList);

// points.geometry.setAttribute('position', new THREE.Float32BufferAttribute(ConfigList[0].pointVertices, 3));

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

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
