import * as THREE from 'three';
// 暂时不考虑导入模型
export function getVerticesFromMesh(mesh: THREE.Mesh) {
  const vertices: number[] = [];
  function processMesh(_mesh: THREE.Mesh) {
    if (_mesh.isMesh) {
      const geometry = _mesh.geometry;
      const positionAttribute = geometry.getAttribute('position');
      if (positionAttribute) {
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const z = positionAttribute.getZ(i);
          vertices.push(x, y, z);
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

  return vertices;
}

export const getRandomNumberFormZeroToOne = () => {
  return Math.random() * 2 - 1;
};
