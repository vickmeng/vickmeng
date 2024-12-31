import { CityConfig } from '@/pages/home/canvas/types';
import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, MeshBasicMaterial, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';
// @ts-ignore
import bridge from '../../../../assets/bridge.fbx?url';
import { CAMERA_ROTATION_Y, MODEL_POSITION_X } from '@/pages/home/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';
// @ts-ignore
import font from '../../../../assets/朱雀仿宋.ttf?url';

import dalianUrl from '@/assets/dalian.png';

export const dalianConfig: CityConfig = {
  name: 'dalian',
  name_cn: '大连',
  preColor: new Color(0xf2dd0b),
  UIThemeColor: '#f2dd0b',

  earthRotation: new Euler(0.67, 2.1, 0),
  cameraRotation: new Euler(0, CAMERA_ROTATION_Y, 0),

  cityPosition: new Vector3(-206.73897369824337, 315.6722437805034, -328.0396793998852),

  modelPosition: new Vector3(-MODEL_POSITION_X, 200, 0),
  modelScale: new Vector3(9.6, 1, 38).multiplyScalar(0.8),
  modelRotation: new Euler(MathUtils.degToRad(12), MathUtils.degToRad(320), 0),
  // @ts-ignore
  mesh: undefined,
  loadModel: async (config: CityConfig) => {
    const { modelPosition, modelScale, modelRotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(bridge);
    const mesh = model.children[0];

    const edges = new THREE.EdgesGeometry(mesh.geometry, 1);
    const line = new THREE.LineSegments(edges);
    line.material = new THREE.LineBasicMaterial({
      color: config.preColor,
      transparent: true,
    });

    line.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    line.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    line.scale.set(modelScale.x, modelScale.y, modelScale.z);
    line.name = 'line';
    scene.add(line);

    mesh.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    mesh.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);
    mesh.material = new MeshBasicMaterial({ opacity: 0, transparent: true, depthTest: false });
    mesh.name = 'model';
    scene.add(mesh); // 不展示提供点击区域

    config.line = line;
    config.model = model;
    config.mesh = mesh;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
  getDesc: () => {
    const group = new Group();
    const text1 = new Text();
    text1.name = 'p';
    text1.text =
      '大连是我职业生涯起点,' +
      '两年里让我从小白成长为靠谱开发者。\n' +
      '身处国内最早一批使用Angular的团队（不是Angularjs！），开荒过程收益良多。' +
      '也借此加入了RxCN开源组织，参与Rxjs官方文档及高分文章的翻译校验。';

    const text2 = new Text();
    text2.name = 'h';
    text2.text = '大连商务集团天狗网（2016~2018，前端开发工程师）';
    text2.position.x = 9;
    text2.position.y = -11.5;

    const text3 = new Text();
    text3.name = 'h';
    text3.text = '重点项目1.BI可视化分析系统';
    text3.position.y = -15.5;

    const text4 = new Text();
    text4.name = 'p';
    text4.text = '项目介绍：老的系统还停留在Jquery阶段，我负责可视化功能开发与落地Angular + Typescript技术升级';
    text4.position.y = -19;

    const text5 = new Text();
    text5.name = 'p';
    text5.text = '技术栈：Typescript，Angular，D3.js，G2，Jquery';
    text5.position.y = -25.5;

    const text6 = new Text();
    text6.name = 'h';
    text6.text = '重点项目2.天狗农产品商城';
    text6.position.y = -30;

    const text7 = new Text();
    text7.name = 'p';
    text7.text = '项目介绍：基于Ionic的移动端跨端项目。';
    text7.position.y = -33.5;

    const text8 = new Text();
    text8.name = 'p';
    text8.text = '技术栈：Typescript，Angular，Cordova, Ionic';
    text8.position.y = -38;

    const textList = [text1, text2, text3, text4, text5, text6, text7, text8];
    textList.forEach((_text) => {
      if (_text.name === 'p') {
        _text.fontSize = 2;
        _text.maxWidth = Math.min(_text.maxWidth, 60);
        _text.lineHeight = 1.2;
        _text.font = font;
        _text.overflowWrap = 'break-word';
        _text.material = new MeshBasicMaterial({ color: new Color(0xffffff) });
      } else if (_text.name === 'h') {
        _text.fontSize = 2;
        _text.maxWidth = Math.min(_text.maxWidth, 60);
        _text.lineHeight = 1.2;
        _text.font = font;
        _text.overflowWrap = 'break-word';
        _text.material = new MeshBasicMaterial({ color: new Color(0xf2dd0b) });
      }
    });

    group.add(...textList);
    group.position.set(-18, 210, 400);
    // group.rotation.set(0, 2 * Math.PI * 0.99, 0);

    group.name = 'desc';

    // const gui = new GUI();
    // gui.add(text2.position, 'x', -100, 100, 0.1);
    // gui.add(text2.position, 'y', -100, 100, 0.1);

    return group;
  },
  modelDesc: (
    <>
      <img src={dalianUrl} width={'100%'} />
      <p>这是大连的跨海大桥，是不是很好看？其实现实一点也不好看，灰突突的，还把海景隔绝了，我一直对此耿耿于怀。</p>
      <p>
        大连已不复当年荣光，沦为了低配青岛，十几年没啥变化，沙滩脏兮兮的，海鲜也瘦。唯一推荐的就是森林动物园，真的很棒！
      </p>
    </>
  ),
};
