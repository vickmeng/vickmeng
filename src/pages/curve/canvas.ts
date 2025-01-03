import * as THREE from 'three';
import { CatmullRomCurve3, Mesh } from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 150;
camera.position.y = 150;

const groundGeometry = new THREE.PlaneGeometry(300, 300);
groundGeometry.rotateX(0.5 * Math.PI);

// 创建一个基础材质
const material = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: 2 });
// 创建网格对象（结合几何体和材质）
const ground = new THREE.Mesh(groundGeometry, material);
scene.add(ground);

// // 创建一个立方体几何体
// const wallGeometry = new THREE.PlaneGeometry(300, 300);
// // 创建一个基础材质
// const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x808080, side: 2 });
// // 创建网格对象（结合几何体和材质）
// const wall = new THREE.Mesh(wallGeometry, wallMaterial);
// wall.position.z = -150;
// scene.add(wall);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
const clock = new THREE.Clock();

// const gui = new GUI();
// gui.add(wall.position, 'z', -150, 150, 25);

const flyMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthTest: false,
  uniforms: {
    color: {
      value: new THREE.Color(0x6be6e0),
    },
    x: {
      value: 0.0,
    },
  },
  vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
  fragmentShader: `
          varying vec2 vUv;
          uniform vec3 color;
          uniform float x;
          void main() {
              if(vUv.x < x && vUv.x > x - 0.5){
                float per = 1.0 - (x-vUv.x) / 0.5;
                gl_FragColor = vec4(color, per);
              }else{
                gl_FragColor = vec4(color, 0.2);
                // discard;
              }
          }
        `,
});

function animate() {
  // 飞线动画
  if (flyMaterial.uniforms.x.value >= 1) {
    flyMaterial.uniforms.x.value = 0;
  } else {
    flyMaterial.uniforms.x.value += clock.getDelta() * 1.5;
  }

  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}
animate();

export const add1 = () => {
  const curve = new CatmullRomCurve3(
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 30, 0), new THREE.Vector3(100, 0, 0)],
    false,
    'catmullrom',
    0.3
  );
  // curve.getPoint(100);

  const _geometry = new THREE.TubeGeometry(curve, 100, 2, 8, false);

  const _material = new THREE.MeshBasicMaterial({ color: 0x55da99 });

  const _mesh = new THREE.Mesh(_geometry, _material);

  _mesh.position.z = -50;
  _mesh.name = 'line';

  scene.add(_mesh);

  addPoint(50, 30, _mesh.position.z);
};

export const add2 = () => {
  const curve = new CatmullRomCurve3(
    [new THREE.Vector3(0, 0, 0), new THREE.Vector3(50, 30, 0), new THREE.Vector3(100, 0, 0)],
    false,
    'catmullrom',
    0.8
  );

  const _geometry = new THREE.TubeGeometry(curve, 100, 2, 8, false);

  const _material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const _mesh = new THREE.Mesh(_geometry, _material);

  _mesh.position.z = -25;
  _mesh.name = 'line';
  scene.add(_mesh);
  addPoint(50, 30, _mesh.position.z);
};
//
// export const add3 = () => {
//   const curve = new CatmullRomCurve3(
//     [
//       new THREE.Vector3(0, 0, 0),
//       new THREE.Vector3(20, 30, 0),
//
//       new THREE.Vector3(50, 30, 0),
//       new THREE.Vector3(100, 0, 0),
//     ],
//     false,
//     'catmullrom',
//     0.5
//   );
//
//   const _geometry = new THREE.TubeGeometry(curve, 100, 2, 8, false);
//
//   const _material = new THREE.MeshBasicMaterial({ color: 0xff00ff });
//
//   const _mesh = new THREE.Mesh(_geometry, _material);
//
//   _mesh.position.z = 0;
//   _mesh.name = 'line';
//   scene.add(_mesh);
//   addPoint(20, 30, _mesh.position.z);
//   addPoint(50, 30, _mesh.position.z);
// };

export const add4 = () => {
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(50, 70, 0),
    new THREE.Vector3(100, 0, 0)
  );
  const _geometry = new THREE.TubeGeometry(curve, 100, 2, 8, false);

  const _material = new THREE.MeshBasicMaterial({ color: 0x0001ff });

  const _mesh = new THREE.Mesh(_geometry, _material);

  _mesh.position.z = 25;
  _mesh.name = 'line';
  scene.add(_mesh);

  addPoint(50, 70, _mesh.position.z);
  addPoint(50, 30, _mesh.position.z);
};

export const fly = () => {
  scene.children.filter((child) => child.name === 'line').forEach((child) => ((child as Mesh).material = flyMaterial));
};

const addPoint = (x: number, y: number, z: number) => {
  const _geometry = new THREE.SphereGeometry(5);
  const _material = new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.3 });
  const _mesh = new THREE.Mesh(_geometry, _material);
  _mesh.position.x = x;
  _mesh.position.y = y;
  _mesh.position.z = z;
  scene.add(_mesh);
};
