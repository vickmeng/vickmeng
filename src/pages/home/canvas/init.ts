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
import { MOUSE_ROLL_CAMERA_SPEED_X, MOUSE_ROLL_CAMERA_SPEED_Y } from '@/pages/home/canvas/constants';

export const init = async () => {
  const firstConfig = CityConfigList[0];

  document.querySelector('#timeline-page')!.appendChild(renderer.domElement);

  /**
   * add points start
   * 暂时不显示点
   */

  // scene.add(backgroundMesh);

  initLoadingProgressStore.progress = 10;
  initLoadingProgressStore.message = '完成基础场景初始化,开始模型加载...';
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
  initLoadingProgressStore.message = '完成模型加载,开始数据计算...';

  const desc = firstConfig.getDesc();
  scene.add(desc);
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

      (currentConfig.mesh.material as MeshBasicMaterial).opacity = 0.1;
    } else {
      page.classList.remove('pointer');
      (currentConfig.mesh.material as MeshBasicMaterial).opacity = 0.0;
    }
    /**
     * 鼠标点击模型 end
     */

    /**
     * 镜头跟随
     */
    const cameraOriginRotation = currentConfig.cameraRotation;
    camera.rotation.set(
      cameraOriginRotation.x + mouse.y * MOUSE_ROLL_CAMERA_SPEED_X,
      cameraOriginRotation.y - mouse.x * MOUSE_ROLL_CAMERA_SPEED_Y,
      0
    );
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

    requestIdleCallback(() => {
      AnimationFrameSubject.next(delta);
    });
  });

  requestIdleCallback(() => {
    AnimationFrameSubject.next(clock.getDelta());
  });
};
