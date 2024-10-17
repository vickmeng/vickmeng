import * as THREE from 'three';
import { CatmullRomCurve3, Euler, MathUtils, Mesh, Scene, Vector3 } from 'three';
import { createRandomVerticalPosition, getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';
// @ts-ignore
import ship from './../../assets/ship.fbx?url';
// @ts-ignore
import pumpjack from './../../assets/pumpjack.obj?url';
// @ts-ignore
// import football from './../../assets/football.fbx?url';
import bridge from './../../assets/bridge.fbx?url';
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
  mesh: Mesh;
  loadModal: (config: Config) => Promise<Mesh>;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextCurves: CatmullRomCurve3[];
  // toNextDistance: number;
}

const pumpjackConfig: Config = {
  name: 'pumpjack',
  position: new Vector3(-1000, 0, 0),
  scale: new Vector3(2, 2, 2),
  rotation: new Euler(0, 3.2, 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new OBJLoader();
    const model = await loader.loadAsync(pumpjack);
    const mesh = model.children[0];

    mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    return mesh;
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
const shipConfig: Config = {
  name: 'ship',
  position: new Vector3(1000, 0, 0),
  scale: new Vector3(0.05, 0.05, 0.05),
  rotation: new Euler(0, 0, 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new FBXLoader();
    const shipModel = await loader.loadAsync(ship);

    const mesh = shipModel.children[1].children[0] as Mesh;
    mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    return mesh;
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};

const bridgeConfig: Config = {
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
    mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    return mesh;

    // return model.children.filter((_mesh: Mesh) => {
    //   // 黑名单，有些小细节不要了
    //   const blackList: string[] = ['Cylinder006', 'Cylinder007', 'Cylinder008', 'Cylinder009', 'Line006', 'Line007'];
    //   return !blackList.includes(_mesh.name);
    // });
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};

export const ConfigList: Config[] = [pumpjackConfig, shipConfig, bridgeConfig];

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = (_scene: Scene) => {
  // 率先计算所有点位
  ConfigList.forEach((_config) => {
    // debugger;
    _config.pointVectorList = getVectorListFromMesh({ mesh: _config.mesh });
    _config.pointVertices = getVerticesFromVectors(_config.pointVectorList);
  });

  // 率先计算所有曲线
  ConfigList.forEach((fromConfig, i) => {
    const toConfig: Config | undefined = ConfigList[i + 1];

    if (!toConfig) {
      return;
    }

    // 确定多个坐标作为曲线的V1
    const curveMidPointList: Vector3[] = [];

    const lineVector = new THREE.Vector3().subVectors(toConfig.position, fromConfig.position);

    // 确定点位
    Array(60)
      .fill(null)
      .forEach(() => {
        // const newMidPoint = createRandomVerticalPosition(
        //   new Vector3((Math.random() - 0.5) * 1000, 480, 0),
        //   lineVector,
        //   500
        // );

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
