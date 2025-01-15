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

    const myText = new Text();

    myText.text =
      '成都真不错，早点来好了。\n\n' +
      '这里气候比东北养人，我的强直性脊柱炎也缓解了很多。\n\n' +
      '如今我老婆孩子热炕头，有房有车有贷款，成了一名标准的、幸福的、中国式中年人。\n\n' +
      '可喜的是繁劳的工作并没有消磨掉我对编程的热情，爱自己的职业无疑是一种大幸运。';

    myText.fontSize = 2.3;
    myText.maxWidth = 60;
    myText.lineHeight = 1.2;
    myText.font = font;
    myText.overflowWrap = 'break-word';

    const myText2 = new Text();

    myText2.text = '最后希望所有人开开心心，fighting~~~';

    myText2.fontSize = 3;
    myText2.maxWidth = 60;
    myText2.lineHeight = 1.2;
    myText2.font = font;
    myText2.overflowWrap = 'break-word';

    myText2.position.y = -30;

    myText2.material = new THREE.MeshBasicMaterial({ color: new Color(0x55da99) });

    group.add(myText, myText2);

    group.position.set(-38, 200, 400);

    group.name = 'desc';

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
