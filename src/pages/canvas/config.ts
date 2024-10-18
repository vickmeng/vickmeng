import * as THREE from 'three';
import { CatmullRomCurve3, Euler, Group, MathUtils, Mesh, Scene, Vector3 } from 'three';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';
// @ts-ignore
import ship from './../../assets/ship.fbx?url';
// @ts-ignore
import pumpjack from './../../assets/pumpjack.obj?url';
// @ts-ignore
import bridge from './../../assets/bridge.fbx?url';
// @ts-ignore
import panda from './../../assets/panda.fbx?url';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { scene } from '@/pages/canvas/core';

//
export interface Config {
  name: string;
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
  model: Group;
  mesh: Mesh;
  loadModal: (config: Config) => Promise<void>;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextCurves: CatmullRomCurve3[];
}

const daqingConfig: Config = {
  name: 'pumpjack',
  position: new Vector3(-1000, 0, 0),
  scale: new Vector3(2, 2, 2),
  rotation: new Euler(0, MathUtils.degToRad(190), 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new OBJLoader();
    const model = await loader.loadAsync(pumpjack);
    const mesh = model.children[0];

    config.model = model;
    config.mesh = mesh;

    mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    config.model = model;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};

const dalianConfig: Config = {
  name: 'ship',
  position: new Vector3(1000, 0, 0),
  scale: new Vector3(0.05, 0.05, 0.05),
  rotation: new Euler(0, 0, 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(ship);
    const mesh = model.children[1].children[0] as Mesh;

    config.model = model;
    config.mesh = mesh;

    mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};

const qingdaoConfig: Config = {
  name: 'bridge',
  position: new Vector3(-1100, 200, 0),
  scale: new Vector3(24, 2.5, 95.4),
  rotation: new Euler(0, MathUtils.degToRad(160), 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(bridge);
    const mesh = model.children[0];

    config.model = model;
    config.mesh = mesh;

    mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};

const chengduConfig: Config = {
  name: 'bridge',
  position: new Vector3(1000, 0, 0),
  scale: new Vector3(6, 6, 6),
  rotation: new Euler(0, MathUtils.degToRad(-60), 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(panda);
    const mesh = model.children[0];

    config.model = model;
    config.mesh = mesh;

    mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    model.position.set(position.x, position.y, position.z);
    model.rotation.set(rotation.x, rotation.y, rotation.z);
    model.scale.set(scale.x, scale.y, scale.z);

    scene.add(model);

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};

export const ConfigList: Config[] = [daqingConfig, dalianConfig, qingdaoConfig, chengduConfig];

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = (_scene: Scene) => {
  // 率先计算所有曲线
  ConfigList.forEach((fromConfig, i) => {
    const toConfig: Config | undefined = ConfigList[i + 1];

    if (!toConfig) {
      return;
    }

    // 确定多个坐标作为曲线的V1
    const curveMidPointList: Vector3[] = [];

    // const lineVector = new THREE.Vector3().subVectors(toConfig.position, fromConfig.position);

    // 确定点位
    Array(60)
      .fill(null)
      .forEach(() => {
        const newMidPoint = new Vector3(
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000 + 480,
          (Math.random() - 0.5) * 1000
        );

        curveMidPointList.push(newMidPoint); // 由1/3位置附近随意点位作为V1
      });

    // 设置曲线
    fromConfig.pointVectorList.forEach((formVector, index) => {
      const toVector = toConfig.pointVectorList[index];

      const curve = new CatmullRomCurve3([formVector, curveMidPointList[index % curveMidPointList.length], toVector]);
      curve.getPoints(500);
      fromConfig.toNextCurves.push(curve);
    });
  });
};
