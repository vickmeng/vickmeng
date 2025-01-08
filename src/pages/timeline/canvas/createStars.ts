import { AnimationFrameSubject, camera } from '@/pages/timeline/canvas/core';
import { BufferAttribute, BufferGeometry, Group, Points, PointsMaterial, TextureLoader, Vector3 } from 'three';
import circleImg from '@/assets/circle.png';

const createOneGroupStars = () => {
  const numPoints = 50;
  const minDistance = 100;
  const maxDistance = 2000;
  // 创建点几何体
  const pointsGeometry = new BufferGeometry();
  const positions = new Float32Array(numPoints * 3);

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
  }

  // 将位置数据、大小数据和颜色数据设置到几何体的属性中
  pointsGeometry.setAttribute('position', new BufferAttribute(positions, 3));
  // pointsGeometry.setAttribute('size', new BufferAttribute(sizes, 1));

  const sprite = new TextureLoader().load(circleImg);

  // 创建点材质，设置相关属性，这里使用PointsMaterial并开启顶点颜色
  const pointsMaterial = new PointsMaterial({
    sizeAttenuation: true, // 根据距离衰减大小，使远处的点看起来更小
    transparent: true,
    map: sprite,
    size: 4,
    color: 0x437ca6,
    opacity: 0.8,
  });

  // 旋转方向随机一些，这个处理比较粗糙
  const rotationX = (Math.random() - 0.5) * 0.1;
  const rotationY = Math.random() * 0.1;
  // const rotationZ = Math.random() * 0.1;

  AnimationFrameSubject.asObservable().subscribe((delta) => {
    points.rotation.x += delta * rotationX;
    points.rotation.y += delta * rotationY;
    // 绕Z轴效果不好
    // points.rotation.z += delta * rotationZ;
  });

  // 创建点对象（粒子系统）
  const points = new Points(pointsGeometry, pointsMaterial);
  return points;
};
export const createStars = () => {
  const group = new Group();
  // 随便加几组星星
  group.add(
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars(),
    createOneGroupStars()
  );

  return group;
};
