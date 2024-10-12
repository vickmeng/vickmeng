import * as THREE from 'three';
import { BoxGeometry, CubicBezierCurve3, Mesh, Scene, SphereGeometry, Vector3 } from 'three';
import { createNearVector, getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';

//
export interface Config {
  position: Vector3;
  mesh: Mesh;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextBezierCurves: CubicBezierCurve3[];
}

export const ConfigList: Config[] = [
  {
    position: new Vector3(-8500, 0, 0),
    mesh: new THREE.Mesh(
      new BoxGeometry(500, 500, 500, 10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true })
    ),
    pointVectorList: [],
    pointVertices: [],
    toNextBezierCurves: [],
  },
  {
    position: new Vector3(8500, 0, 0),
    mesh: new THREE.Mesh(
      new SphereGeometry(300, 40, 40),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    ),
    pointVectorList: [],
    pointVertices: [],
    toNextBezierCurves: [],
  },
];

const BEZIER_CURVE_AMOUNT = 10;

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = (scene: Scene) => {
  // 率先计算所有点位
  ConfigList.forEach((_config) => {
    _config.pointVectorList = getVectorListFromMesh({ mesh: _config.mesh, position: _config.position });
    _config.pointVertices = getVerticesFromVectors(_config.pointVectorList);
  });

  // 率先计算所有贝塞尔曲线 TODO
  ConfigList.forEach((fromConfig, i) => {
    const toConfig: Config | undefined = ConfigList[i + 1];

    if (!toConfig) {
      return;
    }

    const bezierCurveV1List: Vector3[] = [];
    const bezierCurveV2List: Vector3[] = [];

    const fromBaseVector = createNearVector(fromConfig.position, 18000);
    const toBaseVector = createNearVector(toConfig.position, 12000);

    // 确定点位
    Array(BEZIER_CURVE_AMOUNT)
      .fill(null)
      .forEach(() => {
        const newBezierCurveV1 = createNearVector(fromBaseVector, 6000);
        const newBezierCurveV2 = createNearVector(toBaseVector, 6000);

        bezierCurveV1List.push(newBezierCurveV1);
        bezierCurveV2List.push(newBezierCurveV2);

        // 测试
        const testPoint = new THREE.Mesh(new SphereGeometry(20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        testPoint.position.copy(newBezierCurveV1);
        scene.add(testPoint);
        // 测试
        const testPoint2 = new THREE.Mesh(new SphereGeometry(20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        testPoint2.position.copy(newBezierCurveV2);
        scene.add(testPoint2);
      });

    // 设置曲线
    fromConfig.pointVectorList.forEach((formVector, index) => {
      const toVector = toConfig.pointVectorList[index];

      const curve = new THREE.CubicBezierCurve3(
        formVector,
        bezierCurveV1List[Math.floor(Math.random() * 10)],
        bezierCurveV2List[Math.floor(Math.random() * 10)],
        toVector
      );

      const points = curve.getPoints(500);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);

      const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

      // Create the final object to add to the scene
      const curveObject = new THREE.Line(geometry, material);

      scene.add(curveObject);
    });
  });
};
