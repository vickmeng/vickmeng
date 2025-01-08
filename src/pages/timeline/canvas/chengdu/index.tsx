import { CityConfig } from '@/pages/timeline/canvas/types';
import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/timeline/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/timeline/canvas/utils/utils';
// @ts-ignore
import mark from '../../../../assets/mark.fbx?url';
import { CAMERA_ROTATION_Y, MODEL_POSITION_X } from '@/pages/timeline/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';
// @ts-ignore
import font from '../../../../assets/朱雀仿宋.ttf?url';
import chengduUrl from '@/assets/chengdu.jpeg';

export const chengduConfig: CityConfig = {
  name: 'chengdu',
  name_cn: '成都',
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
    text1.text = '2019年定居成都，经历了两段美妙的工作经历。';

    const text2 = new Text();
    text2.name = 'h';
    text2.text = 'Thoughtworks（2019~2021，前端主程）';
    text2.position.x = 12;
    text2.position.y = -3.2;
    //
    const text3 = new Text();
    text3.name = 'p';
    text3.text =
      '我加入的是海外业务线，高度遵循敏捷开发，报价出奇高（4500/人天）。我在这领略了TDD，Pair，Showcase，Review等一系列的工程实践。';
    text3.position.y = -6.5;

    const text4 = new Text();
    text4.name = 'h';
    text4.text = '重点项目.FormBuilder无代码表单配置平台';
    text4.position.y = -13;
    //
    const text5 = new Text();
    text5.name = 'p';
    text5.text =
      '项目介绍：为新加坡政府打造的无代码表单生成平台，类似于金数据。分设计端（Angular）和填写端（React）与自研基础组件库（React）。我负责前端部分整体设计。开发者分别来自中国、新加坡、印度，也是我首次跨国合作。';
    text5.position.y = -18;

    const text6 = new Text();
    text6.name = 'p';
    text6.text = '技术栈：Typescript，Angular，React，Formik，testing_library，Lerna';
    text6.position.y = -29;

    const text7 = new Text();
    text7.name = 'p';
    text7.text =
      '后续：在项目过程中，深感React在表单场景的乏力，于是着手开发rx_form并于2022年完成，做到了灵活、高性能、跨端、跨框架，提供了99%的单元测试覆盖和完整的文档。';
    text7.position.y = -33;

    const text8 = new Text();
    text8.name = 'h';
    text8.text = '中建电商（2021至今，物流创新团队前端负责人）';
    text8.position.x = 10;
    text8.position.y = -42.5;

    const text9 = new Text();
    text9.name = 'p';
    text9.text =
      '主要职责：带领团队从0开始，主导3条业务线10余个分别运行于PC端，手机原生，小程序等不同平台的应用。\n负责内部协调，规范制定，内训，代码审核，重难点攻坚，招评标等工作。团队由本部员工，外包员工，临时劳务等多角色组成，人数最高达12人。';
    text9.position.y = -46.0;

    const text10 = new Text();
    text10.name = 'p';
    text10.text =
      '技术栈：Typescript，React，React_native，React_native_web，Taro，rx_form，Umi，基于pnpm的monorepo，three，antd，qiankun';
    text10.position.y = -59;

    const textList = [text1, text2, text3, text4, text5, text6, text7, text8, text9, text10];
    textList.forEach((_text) => {
      if (_text.name === 'p') {
        _text.fontSize = 2;
        _text.maxWidth = Math.min(_text.maxWidth, 64);
        _text.lineHeight = 1.2;
        _text.font = font;
        _text.overflowWrap = 'break-word';
        _text.material = new MeshBasicMaterial({ color: new Color(0xffffff) });
      } else if (_text.name === 'h') {
        _text.fontSize = 2;
        _text.maxWidth = Math.min(_text.maxWidth, 64);
        _text.lineHeight = 1.2;
        _text.font = font;
        _text.overflowWrap = 'break-word';
        _text.material = new MeshBasicMaterial({ color: new Color(0x55da99) });
      }
    });

    group.add(...textList);

    group.position.set(-38, 212, 400);

    group.name = 'desc';

    // const gui = new GUI();
    //
    // gui.add(text2.position, 'x', -100, 100, 0.1);

    return group;
  },
  modelDesc: (
    <>
      <img src={chengduUrl} width={'100%'} />
      <p>成都首屈一指的城市名片应该是熊猫，但我个人无感，一个个脏兮兮的，毛都黄了。</p>
      <p>其次应该是火锅，不过我是北方人更喜欢涮肉蘸芝麻酱。</p>
      <p>再其次就是三星堆，可惜我没见识成，上次去的时候不知道要提前预约，扑了个空，下次还去。（2024夏天）</p>
    </>
  ),
};
