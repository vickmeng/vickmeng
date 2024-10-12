import * as THREE from 'three';
import { BoxGeometry, Mesh, SphereGeometry, Vector3 } from 'three';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';

export interface Config {
  position: Vector3;
  mesh: Mesh;
  pointVectorList: Vector3[];
  pointVertices: number[];
}

export const ConfigList: Config[] = [
  {
    position: new Vector3(-0, 0, 0),
    mesh: new THREE.Mesh(
      new BoxGeometry(100, 100, 100, 10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true })
    ),
    pointVectorList: [],
    pointVertices: [],
  },
  {
    position: new Vector3(600, 0, 0),
    mesh: new THREE.Mesh(
      new SphereGeometry(80, 60, 60),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    ),
    pointVectorList: [],
    pointVertices: [],
  },
];

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = () => {
  // 率先计算所有点位
  ConfigList.forEach((_config) => {
    _config.pointVectorList = getVectorListFromMesh({ mesh: _config.mesh, position: _config.position });
    _config.pointVertices = getVerticesFromVectors(_config.pointVectorList);
  });

  // 率先计算所有贝塞尔曲线 TODO
};
