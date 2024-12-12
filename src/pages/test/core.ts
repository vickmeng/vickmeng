import * as THREE from 'three';
import { Color } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createBackground } from '@/pages/test/createBackground';

// 创建场景
const scene = new THREE.Scene();

scene.background = new Color(0xf2f2f2);

// 创建相机
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.z = 400;

// 创建渲染器
const renderer = new THREE.WebGLRenderer({
  // antialias: true,
  // anti
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const bg = createBackground({ camera });

scene.add(bg);

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
