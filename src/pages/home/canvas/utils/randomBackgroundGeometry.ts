import * as THREE from 'three';

export const randomBackgroundGeometry = () => {
  // 创建BufferGeometry对象
  const geometry = new THREE.BufferGeometry();

  // 设置平面的宽度、高度以及分段数，可根据实际需求调整参数
  const width = window.innerWidth * 1.2;
  const height = window.innerHeight;
  const widthSegments = Math.floor(window.innerWidth / 25);
  const heightSegments = Math.floor(window.innerHeight / 25);

  // 计算顶点数量，每个分段点都是一个顶点，再加1是因为包含边界点
  const numVertices = (widthSegments + 1) * (heightSegments + 1);

  // 创建用于存储顶点位置数据的Float32Array，每个顶点有x、y、z三个坐标分量，所以长度乘以3
  const positions = new Float32Array(numVertices * 3);

  // 填充顶点位置数据，构建平面的顶点坐标
  let index = 0;
  for (let y = 0; y <= heightSegments; y++) {
    const vY = (y / heightSegments) * height - height / 2;
    for (let x = 0; x <= widthSegments; x++) {
      const vX = (x / widthSegments) * width - width / 2;
      positions[index] = vX + (Math.random() - 0.5) * 10;
      positions[index + 1] = vY + (Math.random() - 0.5) * 10;
      positions[index + 2] = (Math.random() - 0.5) * 10;
      index += 3;
    }
  }

  // 将顶点位置数据设置到BufferGeometry中
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

  // 设置面的索引数据（用于定义如何将顶点连接成面）
  const indices = [];
  for (let y = 0; y < heightSegments; y++) {
    for (let x = 0; x < widthSegments; x++) {
      const a = y * (widthSegments + 1) + x;
      const b = y * (widthSegments + 1) + x + 1;
      const c = (y + 1) * (widthSegments + 1) + x + 1;
      const d = (y + 1) * (widthSegments + 1) + x;
      indices.push(a, b, c);
      indices.push(a, c, d);
    }
  }
  const indexAttribute = new THREE.BufferAttribute(new Uint16Array(indices), 1);
  geometry.setIndex(indexAttribute);

  return geometry;
};
