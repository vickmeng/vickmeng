import * as THREE from 'three';
import { Color } from 'three';
import { Subject } from 'rxjs';
import { SCENE_BACKGROUND_COLOR } from '@/pages/home/canvas/constants';
import { createEarth } from '@/pages/home/canvas/createEarth';
import { EffectComposer, EffectPass, RenderPass } from 'postprocessing';

export const AnimationFrameSubject = new Subject();

export const scene = new THREE.Scene();

scene.background = new Color(SCENE_BACKGROUND_COLOR);

export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(0, 180, 500);

export const points = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ size: 0.01, transparent: true })
);
scene.add(points);

const createEarthRes = await createEarth();
export const earthGroup = createEarthRes.earthGroup;

scene.add(earthGroup);

/**
 * 创建环境光 start
 */

export const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

export const pLight = new THREE.PointLight(0xffffff, 50000);
pLight.position.set(0, -100, 0);
scene.add(pLight);

/**
 * 创建环境光 end
 */

export const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;

export const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// composer.addPass(new EffectPass(camera, createSunRes.sunGodRaysEffect));
composer.addPass(new EffectPass(camera, createEarthRes.earthOutlineEffect));

export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();
