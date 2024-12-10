import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import car from './car.jpg';
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
});

material.onBeforeCompile = function (shader) {
  shader.vertexShader = shader.vertexShader.replace(
    'void main() {',
    `
    varying vec3 vPosition;//顶点位置插值后的坐标
    void main(){
      // 顶点位置坐标模型矩阵变换后，进行插值计算
      vPosition = position;
      // vPosition = vec3(modelMatrix * vec4( position, 1.0 ));

    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    'void main() {',
    `
    uniform float y; //变化的y控制光带高度
    float w = 10.0;//光带宽度一半
    varying vec3 vPosition;//顶点位置插值后的坐标
    void main(){
    `
  );

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <dithering_fragment>',
    `
    #include <dithering_fragment>
         // y随着时间改变光带位置也会改变
        if(vPosition.y >= y && vPosition.y < y + w ){
          float per = (vPosition.y-y)/w;//范围0~1
          gl_FragColor.rgb = mix( vec3(1.0,1.0,0.0),gl_FragColor.rgb, per);
        }
        
        if(vPosition.y < y && vPosition.y > y - w ){
          float per = (y-vPosition.y)/w;//范围0~1
          gl_FragColor.rgb = mix( vec3(1.0,1.0,0.0),gl_FragColor.rgb, per);
        }
        
    `
  );
  shader.uniforms.y = { value: 0 };

  mesh.shader = shader;
};

const geometry = new THREE.BoxGeometry(40, 100, 100);

const mesh = new THREE.Mesh(geometry, material); // 点模型对象

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
