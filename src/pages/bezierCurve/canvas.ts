import * as THREE from 'three';
// @ts-ignore
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';
const createPoint = (params: { position: THREE.Vector3; color: number }) => {
  const _point = new THREE.Mesh(
    new THREE.SphereGeometry(3),
    new THREE.MeshBasicMaterial({ color: params.color, transparent: true, opacity: 0.5 })
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

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 150;
camera.position.y = 150;

const controls = new OrbitControls(camera, renderer.domElement);

const axesHelper = new THREE.AxesHelper(120);
scene.add(axesHelper);

const groundGeometry = new THREE.PlaneGeometry(300, 100);
groundGeometry.rotateX(0.5 * Math.PI);
const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc, side: 2, transparent: true, opacity: 0.8 });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
scene.add(ground);

const vP1 = new THREE.Vector3(-100, 0, 0);
const vP2 = new THREE.Vector3(-50, 100, 0);
const vP3 = new THREE.Vector3(100, 0, 0);

const bezierCurve = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x0000ff }));

scene.add(bezierCurve);

const P1 = createPoint({ position: vP1, color: 0xff0000 });
const P2 = createPoint({ position: vP2, color: 0xff0000 });
const P3 = createPoint({ position: vP3, color: 0xff0000 });
scene.add(P1, P2, P3);

const Q1 = createPoint({ position: new THREE.Vector3(0, 0, 0), color: 0x00ff00 });
const Q2 = createPoint({ position: new THREE.Vector3(0, 0, 0), color: 0x00ff00 });
const Q3 = createPoint({ position: new THREE.Vector3(0, 0, 0), color: 0x00ff00 });
scene.add(Q1, Q2, Q3);

const assistLine1 = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff00ff }));
const assistLine2 = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff00ff }));
const assistLine3 = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xff00ff }));
scene.add(assistLine1);
scene.add(assistLine2);
scene.add(assistLine3);

const bezierCurveParams = { t: 0.5 };

const gui = new GUI();
gui.add(bezierCurveParams, 't', 0, 1, 0.01);
gui.add(vP2, 'x', -200, 200, 1);
gui.add(vP2, 'y', -200, 200, 1);
gui.add(vP2, 'z', -200, 200, 1);

function animate() {
  const vQ1 = new THREE.Vector3().copy(vP1).lerp(vP2, bezierCurveParams.t);
  const vQ3 = new THREE.Vector3().copy(vP2).lerp(vP3, bezierCurveParams.t);
  const vQ2 = new THREE.Vector3().copy(vQ1).lerp(vQ3, bezierCurveParams.t);

  Q1.position.copy(vQ1);
  Q2.position.copy(vQ2);
  Q3.position.copy(vQ3);

  P2.position.copy(vP2);

  assistLine1.geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([vP1.x, vP1.y, vP1.z, vP2.x, vP2.y, vP2.z], 3)
  );

  assistLine2.geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([vQ1.x, vQ1.y, vQ1.z, vQ3.x, vQ3.y, vQ3.z], 3)
  );

  assistLine3.geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([vP2.x, vP2.y, vP2.z, vP3.x, vP3.y, vP3.z], 3)
  );

  const curve = new THREE.QuadraticBezierCurve3(vP1, vP2, vP3);
  const points = curve.getPoints(50);

  bezierCurve.geometry.setFromPoints(points);

  controls.update();
  renderer.render(scene, camera);

  requestIdleCallback(animate);
}
animate();
