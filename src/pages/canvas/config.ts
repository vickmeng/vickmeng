import * as THREE from 'three';
import { BoxGeometry, CatmullRomCurve3, Mesh, Scene, SphereGeometry, Vector3 } from 'three';
import { createRandomVerticalPosition, getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';

//
export interface Config {
  position: Vector3;
  mesh: Mesh;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextCurves: CatmullRomCurve3[];
  // toNextDistance: number;
}

export const ConfigList: Config[] = [
  {
    position: new Vector3(-1000, 0, 0),
    mesh: new THREE.Mesh(
      new BoxGeometry(200, 300, 200, 10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true })
    ),
    pointVectorList: [],
    pointVertices: [],
    toNextCurves: [],
    // toNextDistance: 0,
  },
  {
    position: new Vector3(1000, 0, 0),
    // mesh: new THREE.Mesh(
    //   new BoxGeometry(200, 300, 200, 10, 10, 10),
    //   new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true })
    // ),
    mesh: new THREE.Mesh(
      new SphereGeometry(300, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, wireframe: true })
    ),
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
