import * as THREE from 'three';

interface Params {
  mesh: THREE.Mesh;
  position: THREE.Vector3;
}

// 暂时不考虑导入模型
export function getVerticesFromMesh(params: Params) {
  const { mesh, position } = params;

  const vertices: number[] = [];
  function processMesh(_mesh: THREE.Mesh) {
    if (_mesh.isMesh) {
      const geometry = _mesh.geometry;
      const positionAttribute = geometry.getAttribute('position');

      if (positionAttribute) {
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i) + position.x;
          const y = positionAttribute.getY(i) + position.y;
          const z = positionAttribute.getZ(i) + position.z;

          // 随机差值 让点位更多些
          const interpolatePoints: number[] = Array(20)
            .fill(null)
            .reduce((pre) => {
              const _point = createNearPosition({ x, y, z }, 10);
              pre.push(_point.x, _point.y, _point.z);

              return pre;
            }, []);
          vertices.push(x, y, z, ...interpolatePoints);
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

const createNearPosition = (position: { x: number; y: number; z: number }, range: number) => {
  return {
    x: position.x + (Math.random() - 0.5) * range,
    y: position.y + (Math.random() - 0.5) * range,
    z: position.z + (Math.random() - 0.5) * range,
  };
};
