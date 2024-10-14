import * as THREE from 'three';
import { BoxGeometry, CatmullRomCurve3, Mesh, Scene, SphereGeometry, Vector3 } from 'three';
import {
  createNearVector,
  createVerticalPosition,
  getVectorListFromMesh,
  getVerticesFromVectors,
} from '@/pages/canvas/utils';
import { CURVE_V_AMOUNT } from '@/pages/canvas/constants';

//
export interface Config {
  position: Vector3;
  mesh: Mesh;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextCurves: CatmullRomCurve3[];
  toNextDistance: number;
}

export const ConfigList: Config[] = [
  {
    position: new Vector3(0, 0, 0),
    mesh: new THREE.Mesh(
      new BoxGeometry(500, 500, 500, 10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true })
    ),
    pointVectorList: [],
    pointVertices: [],
    toNextCurves: [],
    toNextDistance: 0,
  },
  {
    position: new Vector3(2000, 0, 0),
    mesh: new THREE.Mesh(
      new SphereGeometry(300, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true })
    ),
    pointVectorList: [],
    pointVertices: [],
    toNextCurves: [],
    toNextDistance: 0,
  },
];

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = (scene: Scene) => {
  // 率先计算所有点位
  ConfigList.forEach((_config) => {
    _config.pointVectorList = getVectorListFromMesh({ mesh: _config.mesh, position: _config.position });
    _config.pointVertices = getVerticesFromVectors(_config.pointVectorList);
  });

  // 率先计算所有曲线
  ConfigList.forEach((fromConfig, i) => {
    const toConfig: Config | undefined = ConfigList[i + 1];

    if (!toConfig) {
      return;
    }

    // 确定多个坐标作为曲线的V1
    const bezierCurveV1List: Vector3[] = [];
    // 确定多个坐标作为曲线的V2
    const bezierCurveV2List: Vector3[] = [];

    const diffVector = toConfig.position.clone().sub(fromConfig.position);
    const lineVector = new THREE.Vector3().subVectors(toConfig.position, fromConfig.position);
    const distance = toConfig.position.distanceTo(fromConfig.position);

    fromConfig.toNextDistance = distance;

    const fromBaseVector = createVerticalPosition(
      fromConfig.position.clone().add(diffVector.clone().multiplyScalar(1 / 3)),
      lineVector,
      diffVector.length() / 2
    );

    const toBaseVector = createVerticalPosition(
      fromConfig.position.clone().add(diffVector.clone().multiplyScalar(2 / 3)),
      lineVector,
      diffVector.length() / 2
    );

    // 确定点位
    Array(CURVE_V_AMOUNT)
      .fill(null)
      .forEach(() => {
        const newBezierCurveV1 = createNearVector(fromBaseVector, diffVector.length() / 3);
        const newBezierCurveV2 = createNearVector(toBaseVector, diffVector.length() / 3);

        bezierCurveV1List.push(newBezierCurveV1); // 由1/3位置附近随意点位作为V1
        bezierCurveV2List.push(newBezierCurveV2); // 由2/3位置附近随意点位作为V2
      });

    // 设置曲线
    fromConfig.pointVectorList.forEach((formVector, index) => {
      const toVector = toConfig.pointVectorList[index];

      const curve = new CatmullRomCurve3([
        formVector,
        bezierCurveV1List[Math.floor(Math.random() * CURVE_V_AMOUNT)],
        bezierCurveV2List[Math.floor(Math.random() * CURVE_V_AMOUNT)],
        toVector,
      ]);
      curve.getPoints(distance / 20);

      fromConfig.toNextCurves.push(curve);
    });
  });
};
