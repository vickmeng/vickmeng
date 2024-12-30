import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3 } from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';

// @ts-ignore
import pumpjack from '../../../../assets/pumpjack.obj?url';
import { CityConfig } from '@/pages/home/canvas/types';
import { CAMERA_ROTATION_Y, MODEL_POSITION_X } from '@/pages/home/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';

// @ts-ignore
import font from '../../../../assets/朱雀仿宋.ttf?url';

export const daqingConfig: CityConfig = {
  name: 'daqing',
  preColor: new Color(0x6be6e0),
  UIThemeColor: '#6be6e0',
  earthRotation: new Euler(0.74, 1.96, 0),
  cameraRotation: new Euler(0, CAMERA_ROTATION_Y, 0),

  cityPosition: new Vector3(-223.14059996451869, 352.99110522483477, -274.9646382348542),

  modelPosition: new Vector3(-MODEL_POSITION_X, 0, 0),
  modelScale: new Vector3(1, 1, 1).multiplyScalar(1),
  modelRotation: new Euler(0, MathUtils.degToRad(240), 0),
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
    line.name = 'line';
    scene.add(line);

    mesh.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    mesh.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);
    // mesh.material = new MeshBasicMaterial({ visible: false });
    // visible无法享受outlinePass
    mesh.material = new MeshBasicMaterial({ opacity: 0, transparent: true, depthTest: false });

    mesh.name = 'model';

    scene.add(mesh); // 不展示提供点击区域

    config.line = line;
    config.mesh = mesh;
    config.model = model;

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
      '我是老孟，生在油城大庆。\n\n' +
      '这座工业化堡垒被寒冷的朔风刻上了粗粝硬朗的气息。钢铁的架构、高耸的烟囱以及巨大的工程车，构成了城市的主调，每一寸空气都弥漫着一种对精细的天然拒斥。\n' +
      '人们像抽油机一样，被无形的力量驱动着在既定轨道上运转，想象力在乏味的劳作中渐渐枯萎。\n\n' +
      '我曾想过，如今成为一名开发者，是否是对那段创造力留白的岁月的填补？';

    myText.fontSize = 2.3;
    myText.maxWidth = 60;
    myText.lineHeight = 1.2;
    myText.font = font;
    myText.overflowWrap = 'break-word';

    myText.material = new MeshBasicMaterial({ color: new Color(0xffffff) });

    group.add(myText);
    group.position.set(-18, 194, 400);
    // group.rotation.set(0, 2 * Math.PI * 0.999, 0);

    group.name = 'desc';

    return group;
  },
};
