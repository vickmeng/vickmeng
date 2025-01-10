import { Subject } from 'rxjs';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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
// scene.background = new THREE.Color(0xaaaaaa);

scene.fog = new THREE.FogExp2(0x000000, 0.025);
// scene.fog = new THREE.Fog(0x000000, 1, 40);

export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 50;
camera.position.y = 8;

/**
 * 光 start
 */
export const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
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
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.near = 0.1;
// directionalLight.shadow.bias = -0.0001;

scene.add(directionalLight);
const helper = new THREE.DirectionalLightHelper(directionalLight, 100);
scene.add(helper);
// const light = new THREE.PointLight(0xff0000, 100000, 1000);
// light.castShadow = true;
// light.position.set(-150, 150, 0);
// scene.add(light);
//
// const helper = new THREE.PointLightHelper(light, 100);
// scene.add(helper);

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
