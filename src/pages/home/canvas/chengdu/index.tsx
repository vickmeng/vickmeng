import { CityConfig } from '@/pages/home/canvas/types';
import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';
// @ts-ignore
import mark from '../../../../assets/mark.fbx?url';
import { CAMERA_ROTATION_Y, MODEL_POSITION_X } from '@/pages/home/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';
import font from '../../../../assets/朱雀仿宋.ttf?url';
import { GUI } from 'dat.gui';

export const chengduConfig: CityConfig = {
  name: 'chengdu',
  preColor: new Color(0x55da99),
  UIThemeColor: '#55da99',

  earthRotation: new Euler(0.4, 3.26, 0),
  cameraRotation: new Euler(0, -CAMERA_ROTATION_Y, 0),
  cityPosition: new Vector3(-110.64084487536095, 256.54357850935827, -414.6613024757423),

  modelPosition: new Vector3(MODEL_POSITION_X, 180, 0),
  modelScale: new Vector3(1, 1, 1).multiplyScalar(60),
  modelRotation: new Euler(MathUtils.degToRad(-90), 0, MathUtils.degToRad(-40)),
  // @ts-ignore
  mesh: undefined,
  loadModel: async (config: CityConfig) => {
    const { modelPosition, modelScale, modelRotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(mark);
    const mesh: Mesh = model.children[0];

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
    text1.text = '成都';

    // const text2 = new Text();
    // text2.name = 'h';
    // text2.text = '大连商务集团天狗网（2016~2018，前端开发工程师）';
    // text2.position.y = -9.5;
    //
    // const text3 = new Text();
    // text3.name = 'h';
    // text3.text = '1.后台BI可视化分析系统';
    // text3.position.y = -13.5;
    //
    // const text4 = new Text();
    // text4.name = 'p';
    // text4.text = '项目介绍：老的系统还停留在Jquery阶段，我负责可视化功能开发与落地Angular2.x + Typescript技术转型';
    // text4.position.y = -17;
    //
    // const text5 = new Text();
    // text5.name = 'p';
    // text5.text = '技术栈：Typescript，Angular2.x，D3.js，G2，Jquery';
    // text5.position.y = -23.5;
    //
    // const text6 = new Text();
    // text6.name = 'h';
    // text6.text = '2.天狗农产品商城';
    // text6.position.y = -28;
    //
    // const text7 = new Text();
    // text7.name = 'p';
    // text7.text = '项目介绍：基于Ionic的移动端跨端项目，这个技术路线在国内并不热门。';
    // text7.position.y = -31.5;
    //
    // const text8 = new Text();
    // text8.name = 'p';
    // text8.text = '技术栈：Typescript，Angular2.x，Cordova, Ionic';
    // text8.position.y = -39;

    const textList = [text1];
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

    group.position.set(-38, 200, 400);

    group.rotation.set(0, 2 * Math.PI * 0.01, 0);

    group.name = 'desc';

    // const gui = new GUI();
    // gui.add(text2.position, 'x', -100, 100, 0.1);
    // gui.add(text2.position, 'y', -100, 100, 0.1);

    return group;
  },
};
