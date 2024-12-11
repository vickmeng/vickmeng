import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 创建场景
const scene = new THREE.Scene();

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 400;

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const texture = new THREE.TextureLoader().load(car);

const material = new THREE.MeshBasicMaterial({
  color: '#0de8c9',
  wireframe: true,
});

const planeGeometry = new THREE.PlaneGeometry(100, 100, 10, 10);

// const geometry = new THREE.BufferGeometry();
// // 定义平面的顶点坐标，这里构建一个简单的矩形平面
// const vertices = new Float32Array([
//   -1,
//   -1,
//   0, // 左下角顶点
//   1,
//   -1,
//   0, // 右下角顶点
//   1,
//   1,
//   0, // 右上角顶点
//   -1,
//   1,
//   0, // 左上角顶点
// ]);
// geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

const mesh = new THREE.Mesh(planeGeometry, material); // 点模型对象

mesh.rotateZ(Math.PI / 6);
// mesh.position.y += 0;

const axesHelper = new THREE.AxesHelper(300);
mesh.add(axesHelper);

scene.add(mesh);

// 创建环境光
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

// 设置渲染器阴影属性
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const clock = new THREE.Clock();

// 渲染循环
function animate() {
  requestAnimationFrame(animate);

  const deltaTime = clock.getDelta();

  if (mesh.shader) {
    mesh.shader.uniforms.y.value += 30 * deltaTime;
    // 一旦y接近模型mesh顶部，重新设置为0，这样扫光反复循环
    if (mesh.shader.uniforms.y.value > 50) {
      mesh.shader.uniforms.y.value = 0;
    }
  }

  renderer.render(scene, camera);
  controls.update();
}

animate();

// 窗口大小变化时调整渲染器和相机
window.addEventListener('resize', function () {
  const width = window.innerWidth;
  const height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});
