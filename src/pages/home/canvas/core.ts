import { Subject } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GUI } from 'dat.gui';

export const AnimationFrameSubject = new Subject<number>();

export const clock = new THREE.Clock();

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

export const scene = new THREE.Scene();

const fog = new THREE.FogExp2(0x000000, 0.024);

scene.fog = fog;

export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 50;
camera.position.y = 8;

/**
 * 光 start
 */
export const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
directionalLight.position.set(-80, 40, 0);
directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
const d = 50;

directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
//
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.near = 0.1;

scene.add(directionalLight);
// const helper = new THREE.DirectionalLightHelper(directionalLight, 100);
// scene.add(helper);

const pointLight = new THREE.PointLight(0xffffff, 100000, 100);
pointLight.position.z = -40;
pointLight.position.y = 18;
pointLight.castShadow = true;
scene.add(pointLight);
//
// const helper = new THREE.PointLightHelper(pointLight, 4);
// scene.add(helper);

const gui = new GUI();
gui.add(pointLight.position, 'x', -100, 100, 1);
gui.add(pointLight.position, 'y', -100, 100, 1);
gui.add(pointLight.position, 'z', -100, 100, 1);
gui.add(fog, 'density', -0, 1, 0.001);

/**
 * 光 end
 */

/**
 * 地板 start
 */
// const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
// groundGeometry.rotateX(-0.5 * Math.PI);
// const groundMaterial = new THREE.MeshBasicMaterial({ color: 0xcccccc });
// const ground = new THREE.Mesh(groundGeometry, groundMaterial);
// scene.add(ground);
/**
 * 地板 end
 */

export const controls = new OrbitControls(camera, renderer.domElement);
