import { Subject } from 'rxjs';
import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { fadeMaterial } from '@/pages/home/canvas/fadeMaterial';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { Group, Vector3 } from 'three';

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

const fog = new THREE.FogExp2(0x000000, 0.022);

scene.fog = fog;

export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 5000);

camera.position.z = 50;
camera.position.y = 8;
camera.lookAt(new Vector3(0, 0, 0));

/**
 * 光 start
 */
export const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 8);
directionalLight.position.set(-80, 40, 0);
directionalLight.lookAt(new THREE.Vector3(0, 0, 0));
directionalLight.castShadow = true;

directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
const d = 100;

directionalLight.shadow.camera.left = -d;
directionalLight.shadow.camera.right = d;
directionalLight.shadow.camera.top = d;
directionalLight.shadow.camera.bottom = -d;
//
directionalLight.shadow.camera.far = 200;
directionalLight.shadow.camera.near = 0.1;

scene.add(directionalLight);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 15);
directionalLight2.position.set(0, 15, -40);
directionalLight2.lookAt(new THREE.Vector3(0, 0, 0));
directionalLight2.castShadow = true;

directionalLight2.shadow.mapSize.width = 2048;
directionalLight2.shadow.mapSize.height = 2048;
const d2 = 100;

directionalLight2.shadow.camera.left = -d2;
directionalLight2.shadow.camera.right = d2;
directionalLight2.shadow.camera.top = d2;
directionalLight2.shadow.camera.bottom = -d2;
//
directionalLight2.shadow.camera.far = 200;
directionalLight2.shadow.camera.near = 0.1;

scene.add(directionalLight2);

// const pointLight = new THREE.PointLight(0xffffff, 100000, 100);
// pointLight.position.z = -40;
// pointLight.position.y = 18;
// pointLight.castShadow = true;
// scene.add(pointLight);

/**
 * 光 end
 */

/**
 * 后期特效滤镜 start
 */
export const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const fadePass = new ShaderPass(fadeMaterial);
composer.addPass(fadePass);
/**
 * 后期特效滤镜 start
 */

/**
 * 轨道helper
 */
export const trackHelperGroup = new Group();
trackHelperGroup.visible = false;
scene.add(trackHelperGroup);
