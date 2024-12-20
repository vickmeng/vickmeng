import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3 } from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';

// @ts-ignore
import pumpjack from '../../../../assets/pumpjack.obj?url';
import { CityConfig } from '@/pages/home/canvas/types';
import { MODEL_POSITION_X } from '@/pages/home/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';

// @ts-ignore
import font from '../../../../assets/朱雀仿宋.ttf?url';
import { GUI } from 'dat.gui';

export const daqingConfig: CityConfig = {
  name: 'daqing',
  preColor: new Color(0x6be6e0),
  UIThemeColor: '#6be6e0',
  earthRotation: new Euler(0.74, 1.96, 0),

  cityPosition: new Vector3(-223.14059996451869, 352.99110522483477, -274.9646382348542),

  modelPosition: new Vector3(-MODEL_POSITION_X, 0, 0),
  modelScale: new Vector3(0.9, 0.9, 0.9),
  modelRotation: new Euler(0, MathUtils.degToRad(220), 0),
  // @ts-ignore
  mesh: undefined,
  loadModel: async (config: CityConfig) => {
    const { modelPosition, modelScale, modelRotation } = config;

    const loader = new OBJLoader();
    const model = await loader.loadAsync(pumpjack);
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

    scene.add(line);

    mesh.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    mesh.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);

    config.line = line;
    config.mesh = mesh;
    config.model = model;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
  getDesc: async () => {
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

    myText.material = new MeshBasicMaterial({ color: new Color(0xffffff) });

    group.add(myText);
    group.position.set(21, 194, 400);
    group.rotation.set(0, 5.84, 0);

    group.name = 'decs';
    const gui = new GUI();

    gui.add(group.position, 'x', -100, 100, 1).onChange((value) => {
      group.position.x = value;
    });
    gui.add(group.position, 'y', 100, 400, 1).onChange((value) => {
      group.position.y = value;
    });

    gui.add(group.rotation, 'x', 0, 2 * Math.PI, 0.01).onChange((value) => {
      group.rotation.x = value;
    });
    gui.add(group.rotation, 'y', 0, 2 * Math.PI, 0.01).onChange((value) => {
      group.rotation.y = value;
    });
    gui.add(group.rotation, 'z', 0, 2 * Math.PI, 0.01).onChange((value) => {
      group.rotation.z = value;
    });
    return group;
  },
};
