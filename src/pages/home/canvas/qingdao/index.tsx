import { CityConfig } from '@/pages/home/canvas/types';
import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';
// @ts-ignore
import ship from '../../../../assets/ship.fbx?url';
import { MODEL_POSITION_X } from '@/pages/home/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';
import { GUI } from 'dat.gui';
// @ts-ignore
import font from '../../../../assets/朱雀仿宋.ttf?url';

export const qingdaoConfig: CityConfig = {
  name: 'qingdao',
  preColor: new Color(0xff7493),
  UIThemeColor: '#ff7493',
  earthRotation: new Euler(0.46, 3.05, 0),
  cityPosition: new Vector3(-210.14429595033295, 297.0576377962532, -342.9229282308912),

  modelPosition: new Vector3(MODEL_POSITION_X, 0, 0),
  modelScale: new Vector3(1, 1, 1).multiplyScalar(0.02),
  modelRotation: new Euler(0, MathUtils.degToRad(100), 0),
  // @ts-ignore
  mesh: undefined,
  loadModel: async (config: CityConfig) => {
    const { modelPosition, modelScale, modelRotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(ship);
    const mesh = model.children[1].children[0] as Mesh;

    const edges = new THREE.EdgesGeometry(mesh.geometry, 1);
    const line = new THREE.LineSegments(edges);
    line.material = new THREE.LineBasicMaterial({
      color: config.preColor,
      transparent: true,
    });

    line.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    line.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    line.scale.set(modelScale.x, modelScale.y, modelScale.z);

    scene.add(line);

    mesh.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    mesh.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);

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
      '我生在油城的大庆。\n\n' +
      '这座工业化堡垒，被寒冷的朔风刻上了粗粝硬朗的气息。钢铁的架构、高耸的烟囱以及巨大的工程车，构成了城市的主调，每一寸空气都弥漫着一种对精细的天然拒斥。\n' +
      '每个人都像是抽油机一样，被无形的力量驱动着，在既定轨道上运转，想象力在枯燥的劳作中渐渐枯萎。\n\n' +
      '我曾想过，如今成为一名前端开发者，是否是试图填补那段创造力留白的岁月？';

    myText.fontSize = 2.3;
    myText.maxWidth = 60;
    myText.lineHeight = 1.2;
    myText.font = font;
    myText.overflowWrap = 'break-word';

    group.position.set(-21, 194, 400);

    group.rotation.set(0, 5.84, 0);

    group.add(myText);
    group.name = 'desc';

    // const gui = new GUI();
    //
    // gui.add(group.position, 'x', -100, 100, 1).onChange((value) => {
    //   group.position.x = value;
    // });
    // gui.add(group.position, 'y', 100, 400, 1).onChange((value) => {
    //   group.position.y = value;
    // });
    //
    // gui.add(group.rotation, 'x', 0, 2 * Math.PI, 0.01).onChange((value) => {
    //   group.rotation.x = value;
    // });
    // gui.add(group.rotation, 'y', 0, 2 * Math.PI, 0.01).onChange((value) => {
    //   group.rotation.y = value;
    // });
    // gui.add(group.rotation, 'z', 0, 2 * Math.PI, 0.01).onChange((value) => {
    //   group.rotation.z = value;
    // });
    return group;
  },
};
