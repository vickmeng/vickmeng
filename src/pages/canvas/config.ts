import * as THREE from 'three';
import { CatmullRomCurve3, Euler, Mesh, Scene, Vector3 } from 'three';
import { createRandomVerticalPosition, getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';
// @ts-ignore
import ship from './../../assets/ship.fbx?url';
import pumpjack from './../../assets/pumpjack.obj?url';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

//
export interface Config {
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

export const ConfigList: Config[] = [
  {
    position: new Vector3(-1000, 0, 0),
    scale: new Vector3(2, 2, 2),
    rotation: new Euler(0, 3.2, 0),
    // @ts-ignore
    mesh: undefined,
    loadModal: async (config: Config) => {
      const { position, scale, rotation } = config;

      const loader = new OBJLoader();
      const pumpjackModel = await loader.loadAsync(pumpjack);
      const mesh = pumpjackModel.children[0];

      mesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });

      mesh.position.set(position.x, position.y, position.z);
      mesh.rotation.set(rotation.x, rotation.y, rotation.z);
      mesh.scale.set(scale.x, scale.y, scale.z);

      return mesh;
    },
    pointVectorList: [],
    pointVertices: [],
    toNextCurves: [],
  },
  {
    position: new Vector3(1000, 0, 0),
    scale: new Vector3(0.05, 0.05, 0.05),
    rotation: new Euler(0, 0, 0),
    // @ts-ignore
    mesh: undefined,
    loadModal: async (config: Config) => {
      const { position, scale, rotation } = config;

      const loader = new FBXLoader();
      const shipModel = await loader.loadAsync(ship);

      const shipMesh = shipModel.children[1].children[0] as Mesh;
      shipMesh.material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true });

      shipMesh.position.set(position.x, position.y, position.z);
      shipMesh.rotation.set(rotation.x, rotation.y, rotation.z);
      shipMesh.scale.set(scale.x, scale.y, scale.z);

      return shipMesh;
    },
    pointVectorList: [],
    pointVertices: [],
    toNextCurves: [],
  },
];

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = (scene: Scene) => {
  // 率先计算所有点位
  ConfigList.forEach((_config) => {
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
        const newMidPoint = createRandomVerticalPosition(
          new Vector3((Math.random() - 0.5) * 1000, 480, 0),
          lineVector,
          500
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
