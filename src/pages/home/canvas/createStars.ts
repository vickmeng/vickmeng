import { camera } from '@/pages/home/canvas/core';
import { BufferAttribute, BufferGeometry, Points, PointsMaterial, TextureLoader, Vector3 } from 'three';
import circleImg from '@/assets/circle.png';

export const createStars = () => {
  const numPoints = 5000;

  const minSize = 10;
  const maxSize = 20;
  const minDistance = 50;
  const maxDistance = 1200;
  // 创建点几何体
  const pointsGeometry = new BufferGeometry();
  const positions = new Float32Array(numPoints * 3);
  const sizes = new Float32Array(numPoints);

  for (let i = 0; i < numPoints; i++) {
    // 随机生成一个在球面上的方向向量（单位向量）
    const randomDirection = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();

    // 在指定的距离范围内随机生成点到中心点的距离
    const randomDistance = Math.random() * (maxDistance - minDistance) + minDistance;

    // 根据方向向量和距离计算点的位置坐标
    const pointPosition = camera.position.clone().add(randomDirection.multiplyScalar(randomDistance));

    // 将点的位置坐标存入positions数组
    const index = i * 3;
    positions[index] = pointPosition.x;
    positions[index + 1] = pointPosition.y;
    positions[index + 2] = pointPosition.z;

    // 随机生成点的大小
    const randomSize = Math.random() * (maxSize - minSize) + minSize;
    // const randomSize = 18;
    sizes[i] = randomSize;

    // 随机生成点的颜色（RGB值）
  }

  // 将位置数据、大小数据和颜色数据设置到几何体的属性中
  pointsGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  pointsGeometry.setAttribute('size', new BufferAttribute(sizes, 1));

  const sprite = new TextureLoader().load(circleImg);

  // 创建点材质，设置相关属性，这里使用PointsMaterial并开启顶点颜色
  const pointsMaterial = new PointsMaterial({
    sizeAttenuation: true, // 根据距离衰减大小，使远处的点看起来更小
    transparent: true,
    map: sprite,
    color: 0x5a9dce,
    // alphaTest: 0.5,
    opacity: 0.8,
  });

  // 创建点对象（粒子系统）
  const points = new Points(pointsGeometry, pointsMaterial);

  return { points };
};
