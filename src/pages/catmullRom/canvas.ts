import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { CatmullRomCurve3 } from 'three';
import { matrix, multiply } from 'mathjs';

/**
 *
 * t:0~1
 * tension:0~1 按理来说超过1也行
 */
const calculate = (params: {
  t: number;
  tension: number;
  PList: [THREE.Vector3, THREE.Vector3, THREE.Vector3, THREE.Vector3];
}) => {
  const { t, tension = 0.5, PList } = params;

  const PMinus2 = PList[0];
  const PMinus1 = PList[1];
  const P0 = PList[2];
  const P1 = PList[3];

  const matrixA = matrix([[1, t, Math.pow(t, 2), Math.pow(t, 3)]]);
  const matrixB = matrix([
    [0, 1, 0, 0],
    [-tension, 0, tension, 0],
    [2 * tension, tension - 3, 3 - 2 * tension, -tension],
    [-tension, 2 - tension, tension - 2, tension],
  ]);

  const matrixC = matrix([
    [PMinus2.x, PMinus2.y, PMinus2.z],
    [PMinus1.x, PMinus1.y, PMinus1.z],
    [P0.x, P0.y, P0.z],
    [P1.x, P1.y, P1.z],
  ]);

  const matrixRes = multiply(matrixA, matrixB, matrixC);

  const value = matrixRes.valueOf();

  // @ts-ignore
  return new THREE.Vector3(value[0][0], value[0][1], value[0][2]);
};

const createPoint = (params: { position: THREE.Vector3; color: number; size: number; opacity: number }) => {
  const _point = new THREE.Mesh(
    new THREE.SphereGeometry(params.size),
    new THREE.MeshBasicMaterial({ color: params.color, transparent: true, opacity: params.opacity, depthTest: false })
  );
  _point.position.copy(params.position);

  return _point;
};

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaaaaaa);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 6;
camera.position.y = 6;

const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(50);
scene.add(axesHelper);

const groundGeometry = new THREE.PlaneGeometry(10, 2);
groundGeometry.rotateX(0.5 * Math.PI);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: 2, transparent: true, opacity: 0.8 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(ground);

const PMinus1 = new THREE.Vector3(-3, 0, 0);
const P0 = new THREE.Vector3(-1, 1, 0);
const P1 = new THREE.Vector3(1, 5, 0);
const P2 = new THREE.Vector3(3, 0, 0);
const P3 = new THREE.Vector3(5, 0.5, 0);

const pointVList = [PMinus1, P0, P1, P2, P3];

const curve = new CatmullRomCurve3(pointVList, false, 'catmullrom', 0.5);
// const curve = new THREE.LineCurve3(pointVList);

const points = curve.getPoints(100);
const geometry = new THREE.BufferGeometry().setFromPoints(points);

const material = new THREE.LineBasicMaterial({ color: 0x0000ff });

// Create the final object to add to the scene
const line = new THREE.Line(geometry, material);
scene.add(line);

pointVList.forEach((v) => {
  const p = createPoint({
    position: v,
    color: 0xff0000,
    size: 0.2,
    opacity: 0.3,
  });
  scene.add(p);
});

for (let i = -50; i <= 50; i += 0.1) {
  const t = i;
  // @ts-ignore
  const position = calculate({ t, tension: 0.5, PList: [PMinus1, P0, P1, P2] });

  const p = createPoint({ position, color: 0x000000, size: 0.05, opacity: 0.8 });
  scene.add(p);
}

// console.log(res);

// const gui = new GUI();

function animate() {
  controls.update();
  renderer.render(scene, camera);

  requestIdleCallback(animate);
}
animate();
