import * as THREE from 'three';
import { Camera, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { getTriangleMidPoint } from '@/pages/home/canvas/utils/getTriangleMidPoint';

export const createBackground = (params: { camera: Camera }) => {
  const { camera } = params;
  // 创建BufferGeometry对象
  const wireframeGeometry = new THREE.BufferGeometry();

  // 设置平面的宽度、高度以及分段数，可根据实际需求调整参数
  const width = window.innerWidth * 1.2;
  const height = window.innerHeight;
  const widthSegments = Math.floor(window.innerWidth / 18);
  const heightSegments = Math.floor(window.innerHeight / 18);

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
      // positions[index + 2] = (Math.random() - 0.5) * 10;
      positions[index + 2] = 0;

      index += 3;
    }
  }

  // 将顶点位置数据设置到BufferGeometry中
  wireframeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

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
  wireframeGeometry.setIndex(indexAttribute);

  const wireframeMaterial = new THREE.MeshBasicMaterial({
    color: 0x312a3c,
    // color: 0xf2f2f2,
    wireframe: true,
  });

  const bgWireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial);

  const backgroundGroup = new THREE.Group();

  const backgroundMeshChips: Mesh[] = [];
  for (let i = 0; i < indices.length / 3; i++) {
    const _geometry = new THREE.BufferGeometry();

    const index1 = indices[i * 3];
    const index2 = indices[i * 3 + 1];
    const index3 = indices[i * 3 + 2];

    const vertices = new Float32Array([
      positions[index1 * 3],
      positions[index1 * 3 + 1],
      positions[index1 * 3 + 2],
      positions[index2 * 3],
      positions[index2 * 3 + 1],
      positions[index2 * 3 + 2],
      positions[index3 * 3],
      positions[index3 * 3 + 1],
      positions[index3 * 3 + 2],
    ]);
    const midPoint = getTriangleMidPoint(vertices);

    _geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const _material = new THREE.MeshBasicMaterial({ color: 0x1e1a25, depthWrite: false });

    const _chip = new THREE.Mesh(_geometry, _material);
    _chip.name = 'bgChip';
    // @ts-ignore
    _chip.midPoint = midPoint;

    backgroundMeshChips.push(_chip);
  }

  backgroundGroup.add(...backgroundMeshChips);

  const group = new THREE.Group();

  bgWireframeMesh.position.z = 1;

  group.add(backgroundGroup);
  group.add(bgWireframeMesh);

  /**
   *
   */

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  document.addEventListener('mousemove', (event) => {
    // 将鼠标坐标归一化到 - 1到1的范围
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(group);
    const bgChipIntersect = intersects.find((intersect) => intersect.object.name === 'bgChip');

    backgroundMeshChips.forEach((chip) => {
      // @ts-ignore
      if (bgChipIntersect?.point && bgChipIntersect.point.distanceTo(chip.midPoint as Vector3) < 13) {
        (chip.material as MeshBasicMaterial).color.set(0x24202d);
      } else {
        (chip.material as MeshBasicMaterial).color.set(0x1e1a25);
      }
    });
  });

  /**
   *
   */

  return group;
};
