import * as THREE from 'three';
import { CatmullRomCurve3, Euler, Mesh, Scene, Vector3 } from 'three';
import { createRandomVerticalPosition, getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';
// @ts-ignore
import ship from './../../assets/ship.fbx?url';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

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
    scale: new Vector3(0.05, 0.05, 0.05),
    rotation: new Euler(0, 40, 0),
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
    // toNextDistance: 0,
  },
  {
    position: new Vector3(1000, 0, 0),
    scale: new Vector3(0.05, 0.05, 0.05),
    rotation: new Euler(0, 40, 0),
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
    // toNextDistance: 0,
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
          new Vector3((Math.random() - 0.5) * 600, 0, 0),
          lineVector,
          500
        );

        curveMidPointList.push(newMidPoint); // 由1/3位置附近随意点位作为V1
      });

    // 设置曲线
    fromConfig.pointVectorList.forEach((formVector, index) => {
      const toVector = toConfig.pointVectorList[index];

      const curve = new CatmullRomCurve3([formVector, curveMidPointList[index % curveMidPointList.length], toVector]);
      const curvePoints = curve.getPoints(500);

      // const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
      //
      // const material = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 1 });
      //
      // const curveObject = new THREE.Line(geometry, material);
      //
      // scene.add(curveObject);

      fromConfig.toNextCurves.push(curve);
    });
  });
};
