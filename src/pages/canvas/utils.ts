import * as THREE from 'three';
import { Vector3 } from 'three';

interface Params {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
}

export const createNearVector = (position: { x: number; y: number; z: number }, range: number) => {
  return new Vector3(
    position.x + (Math.random() - 0.5) * range,
    position.y + (Math.random() - 0.5) * range,
    position.z + (Math.random() - 0.5) * range
  );
};

/**
 * getVectorListFromMesh
 * 网格生成点位，并且进行插值
 * 不考虑高模，正常模型不会有太多点位
 * 写死为50000个 后面会生成50000个贝塞尔曲线
 */
const VECTOR_LIST_AMOUNT = 3000;

// 生成随意点位的范围
const NEAR_VECTOR_RANGE = 10;

export function getVectorListFromMesh(params: Params) {
  const { mesh, position } = params;

  const vectors: Vector3[] = [];
  function processMesh(_mesh: THREE.Mesh) {
    if (_mesh.isMesh) {
      const geometry = _mesh.geometry;
      const positionAttribute = geometry.getAttribute('position');

      // 向下取整 每个点生成这么多个插值
      const interpolateAmount = Math.floor(VECTOR_LIST_AMOUNT / positionAttribute.count) - 1;

      if (positionAttribute) {
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i) + position.x;
          const y = positionAttribute.getY(i) + position.y;
          const z = positionAttribute.getZ(i) + position.z;

          // 随机差值 让点位更多些
          const interpolateVectorList: Vector3[] = Array(interpolateAmount)
            .fill(null)
            .map(() => {
              return createNearVector({ x, y, z }, NEAR_VECTOR_RANGE);
            });

          vectors.push(new Vector3(x, y, z), ...interpolateVectorList);
        }
      }
    }
    if (_mesh.children && _mesh.children.length > 0) {
      for (let i = 0; i < _mesh.children.length; i++) {
        processMesh(_mesh.children[i] as THREE.Mesh);
      }
    }
  }
  processMesh(mesh);

  //  生成插值是向下取整的，肯定会距离要求少了几个，最随机选中当前已有的点进行再补齐
  const shortOfAmount = VECTOR_LIST_AMOUNT - vectors.length;
  Array(shortOfAmount)
    .fill(null)
    .forEach(() => {
      const randomIndex = Math.floor(Math.random() * (vectors.length - 1));
      const randomVector = vectors[randomIndex];
      vectors.push(createNearVector(randomVector, NEAR_VECTOR_RANGE));
    });

  return vectors;
}
// 将坐标转为数据
export const getVerticesFromVectors = (vectors: Vector3[]) => {
  const vertices: number[] = [];

  vectors.forEach((vector) => {
    vertices.push(vector.x, vector.y, vector.z);
  });

  return vertices;
};

export const createVerticalPosition = (point: Vector3, lineVector: Vector3, scalar: number) => {
  // 生成一个与方向向量不平行
  const assistVector = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
  // 进行叉乘与归一化，获取垂直的地方向量
  const perpendicularVector = new THREE.Vector3().crossVectors(lineVector, assistVector).normalize();

  return new THREE.Vector3().addVectors(point, perpendicularVector.multiplyScalar(scalar));
};
