import * as THREE from 'three';
import { MeshBasicMaterial, SphereGeometry } from 'three';
import { CityConfigList, handleCalculateConfigList } from './cityConfig';
import { AnimationFrameSubject, camera, clock, earthGroup, renderer, scene } from '@/pages/home/canvas/core';
import { initLoadingProgressStore } from '@/stores';
// import { GUI } from 'dat.gui';
import { currentIndexStore, switchModelProcessStore } from '@/pages/home/store';
import ThreeMeshUI from 'three-mesh-ui';

export const init = async () => {
  const firstConfig = CityConfigList[0];

  document.querySelector('#timeline-page')!.appendChild(renderer.domElement);

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
   * 初始化地球属性 start
   */
  earthGroup.rotation.set(firstConfig.earthRotation.x, firstConfig.earthRotation.y, firstConfig.earthRotation.z);
  const cityHighLights = earthGroup.children.filter((c) => c.name === 'cityHighLight');

  /**
   * 初始化地球属性 end
   */

  /**
   * 初始化第一个desc start
   */

  /**
   * 初始化第一个desc end
   */

  /**
   * 一次创建所有场景 start
   */

  await Promise.all(
    CityConfigList.map(async (_config, _index) => {
      await _config.loadModel(_config);

      if (_index !== 0) {
        (_config.line.material as MeshBasicMaterial).opacity = 0;
      }
    })
  );

  initLoadingProgressStore.progress = 70;
  initLoadingProgressStore.message = '完成模型加载,开始数据计算';

  const desc = firstConfig.getDesc();
  scene.add(desc);

  // 这只是个标记
  const testMesh = new THREE.Mesh(new SphereGeometry(30), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
  testMesh.position.set(0, 0, 0);
  scene.add(testMesh);
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
   *  计算所有点位以及曲线 start
   */
  handleCalculateConfigList();
  // eslint-disable-next-line
  console.log('===CityConfigList===', CityConfigList);

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
    ThreeMeshUI.update();

    // controls.update();
    requestIdleCallback(() => {
      AnimationFrameSubject.next(undefined);
    });
  });

  requestIdleCallback(() => {
    AnimationFrameSubject.next(undefined);
  });

  // 这个动画永远不停
  AnimationFrameSubject.subscribe(() => {
    const delta = clock.getDelta();

    const activeIndex = switchModelProcessStore.process?.toIndex ?? currentIndexStore.currentIndex;

    // 当前城市大一点
    if (cityHighLights[activeIndex].scale.x > 2) {
      cityHighLights.forEach((_cityMark) => {
        _cityMark.scale.x = 0;
        _cityMark.scale.y = 0;
      });
    } else {
      cityHighLights.forEach((_cityMark, index) => {
        if (index === activeIndex) {
          _cityMark.scale.x += delta * 1.2;
          _cityMark.scale.y += delta * 1.2;
        } else {
          _cityMark.scale.x += delta * 0.3;
          _cityMark.scale.y += delta * 0.3;
        }
      });
    }
  });

  /**
   * 调试点击 start
   */

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  // document.addEventListener('click', (event) => {
  //   // 将鼠标坐标归一化到 - 1到1的范围
  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //   raycaster.setFromCamera(mouse, camera);
  //
  //   const intersects = raycaster.intersectObject(earthGroup.children[0]);
  //
  //   const intersection = intersects[0];
  //
  //   if (!intersection) {
  //     return;
  //   }
  //
  //   const direction = intersection.face.normal.normalize();
  //
  //   // const targetPoint = new THREE.Vector3().copy(earthGroup.position);
  //   const targetPoint = new THREE.Vector3(0, 0, 0);
  //   targetPoint.addScaledVector(direction, 500);
  //
  //   console.log('direction', direction, targetPoint);
  //   // // 获取球体在Group中的相对位置（相对于Group的局部坐标）
  //   // const sphereRelativePositionInGroup = earthGroup.position.clone();
  //   //
  //   // // 获取球体半径
  //   // const sphereRadius = 500;
  //   //
  //   // // 归一化法线向量
  //   // const magnitude = Math.sqrt(normal.x ** 2 + normal.y ** 2 + normal.z ** 2);
  //   // const unit_n = new THREE.Vector3(normal.x / magnitude, normal.y / magnitude, normal.z / magnitude);
  //   //
  //   // // 计算点击点相对于球体中心（在Group局部坐标系下）的坐标
  //   // const clickPointXRelativeToSphereInGroup = sphereRelativePositionInGroup.x + sphereRadius * unit_n.x;
  //   // const clickPointYRelativeToSphereInGroup = sphereRelativePositionInGroup.y + sphereRadius * unit_n.y;
  //   // const clickPointZRelativeToSphereInGroup = sphereRelativePositionInGroup.z + sphereRadius * unit_n.z;
  //   //
  //   const point = new Mesh(new THREE.SphereGeometry(10, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
  //   point.position.set(targetPoint.x, targetPoint.y, targetPoint.z);
  //
  //   //
  //   // console.log(point.position);
  //   earthGroup.add(point);
  // });
  /**
   * 调试点击 end
   */

  // const gui = new GUI();

  // gui.add(container.rotation, 'x', 0, 2 * Math.PI, 0.01).onChange((value) => {
  //   container.rotation.x = value;
  // });
  // gui.add(container.rotation, 'y', 0, 2 * Math.PI, 0.01).onChange((value) => {
  //   container.rotation.y = value;
  // });
  // gui.add(container.rotation, 'z', 0, 2 * Math.PI, 0.01).onChange((value) => {
  //   container.rotation.z = value;
  // });

  // console.log(earthGroup.children);
  //
  // gui.add(earthGroup.children[1].rotation, 'x', 0, 2 * Math.PI, 0.01).onChange((value) => {
  //   earthGroup.children[1].rotation.x = value;
  //   // earthGroup.rotation.x = value;
  // });
  // gui.add(earthGroup.children[1].rotation, 'y', 0, 2 * Math.PI, 0.01).onChange((value) => {
  //   earthGroup.children[1].rotation.y = value;
  // });
  // gui.add(earthGroup.children[1].rotation, 'z', 0, 2 * Math.PI, 0.01).onChange((value) => {
  //   earthGroup.children[1].rotation.z = value;
  // });
};
