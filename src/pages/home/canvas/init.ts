import { MeshBasicMaterial } from 'three';
import { CityConfigList, handleCalculateConfigList } from './cityConfig';
import {
  AnimationFrameSubject,
  camera,
  clock,
  composer,
  earthGroup,
  mouse,
  raycaster,
  renderer,
  scene,
} from '@/pages/home/canvas/core';
import { initLoadingProgressStore } from '@/stores';
// import { GUI } from 'dat.gui';
import { currentIndexStore, switchModelProcessStore } from '@/pages/home/store';
import { isEmpty } from 'lodash';

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
   * 相机
   */
  camera.rotation.copy(firstConfig.cameraRotation);
  /**
   * 相机
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

  /**
   * 高亮模型 start
   */

  document.addEventListener('mousemove', (event) => {
    // 将鼠标坐标归一化到 - 1到1的范围
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const currentConfig = CityConfigList[currentIndexStore.currentIndex];

    const intersects = raycaster.intersectObject(currentConfig.mesh);

    if (switchModelProcessStore.process) {
      return;
    }
    /**
     * 鼠标点击模型 start
     */
    const page = document.querySelector('#timeline-page') as HTMLDivElement;

    if (!isEmpty(intersects)) {
      page.classList.add('pointer');
    } else {
      page.classList.remove('pointer');
    }
    /**
     * 鼠标点击模型 end
     */

    /**
     * 镜头跟随
     */
    const cameraOriginRotation = currentConfig.cameraRotation;
    camera.rotation.set(cameraOriginRotation.x + mouse.y / 60, cameraOriginRotation.y - mouse.x / 60, 0);
    /**
     * 镜头跟随
     */
  });
  /**
   * 高亮模型 end
   */

  AnimationFrameSubject.asObservable().subscribe(() => {
    const delta = clock.getDelta();

    renderer.render(scene, camera);
    composer.render();
    // ThreeMeshUI.update();

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

    requestIdleCallback(() => {
      AnimationFrameSubject.next(undefined);
    });
  });

  requestIdleCallback(() => {
    AnimationFrameSubject.next(undefined);
  });
};
