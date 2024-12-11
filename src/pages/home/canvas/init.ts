import { MeshBasicMaterial } from 'three';
import { ConfigList, handleCalculateConfigList } from './config';
import { AnimationFrameSubject, camera, renderer, scene } from '@/pages/home/canvas/core';
import { initLoadingProgressStore } from '@/stores';
import { delay } from '@/pages/home/canvas/utils/utils';

/**
 * add points start
 * 暂时不显示点
 */

// scene.add(backgroundMesh);

initLoadingProgressStore.progress = 10;
initLoadingProgressStore.message = '完成基础场景初始化,开始模型加载';
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
      (_config.line.material as MeshBasicMaterial).opacity = 0;
    }
  })
);

initLoadingProgressStore.progress = 70;
initLoadingProgressStore.message = '完成模型加载,开始数据计算';

await delay(100);

// // 这只是个标记
// const testMesh = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
// testMesh.position.set(0, 0, 0);
// scene.add(testMesh);
//
// const testMesh1 = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
// testMesh1.position.set(-1000, 0, 0);
// scene.add(testMesh1);
//
// const testMesh2 = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
// testMesh2.position.set(1000, 0, 0);
// scene.add(testMesh2);

/**
 * 一次创建所有场景 end
 */

/**
 *  计算所有点位以及贝塞尔曲线 start
 */
handleCalculateConfigList();
// eslint-disable-next-line
console.log('ConfigList', ConfigList);

initLoadingProgressStore.progress = 100;
initLoadingProgressStore.message = '完成初始化即将进入应用';

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
