import * as THREE from 'three';
import { Color } from 'three';
import { Subject } from 'rxjs';
import { CAMERA_ROTATION_Y, SCENE_BACKGROUND_COLOR } from '@/pages/home/canvas/constants';
import { createEarth } from '@/pages/home/canvas/createEarth';
import { EffectComposer, EffectPass, GodRaysEffect, KernelSize, RenderPass } from 'postprocessing';
import { createSun } from '@/pages/home/canvas/createSun';

export const AnimationFrameSubject = new Subject();

export const scene = new THREE.Scene();

scene.background = new Color(SCENE_BACKGROUND_COLOR);

// const fog = new THREE.FogExp2(0x01050d, 0.0025);
// scene.fog = fog;

export const clock = new THREE.Clock();

// 创建相机
export const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 3000);
camera.position.set(0, 180, 500);

camera.rotation.y = THREE.MathUtils.degToRad(CAMERA_ROTATION_Y);

export const points = new THREE.Points(
  new THREE.BufferGeometry(),
  new THREE.PointsMaterial({ size: 0.01, transparent: true })
);
scene.add(points);

export const earthGroup = await createEarth();

scene.add(earthGroup);

/**
 * 创建环境光 start
 */

export const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
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

export const sun = createSun();

scene.add(sun);

// 太阳光斑 start
export const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const godRaysEffect = new GodRaysEffect(camera, sun, {
  height: 880,
  kernelSize: KernelSize.HUGE,
  density: 0.97,
  decay: 1,
  weight: 0.93,
  exposure: 0.86,
  samples: 200,
  clampMax: 1.0,
});
// 太阳光斑 end

composer.addPass(new EffectPass(camera, godRaysEffect));

export const raycaster = new THREE.Raycaster();
export const mouse = new THREE.Vector2();
//
// const gui = new GUI();
// //
// const effect = godRaysEffect;
// const uniforms = effect.godRaysMaterial.uniforms;
// const blendMode = effect.blendMode;
//
// const params = {
//   resolution: effect.height,
//   blurriness: effect.blurPass.kernelSize + 1,
//   density: uniforms.density.value,
//   decay: uniforms.decay.value,
//   weight: uniforms.weight.value,
//   exposure: uniforms.exposure.value,
//   clampMax: uniforms.clampMax.value,
//   samples: effect.samples,
//   color: sun.material.color.getHex(),
//   opacity: blendMode.opacity.value,
//   'blend mode': blendMode.blendFunction,
// };
//
// gui.add(sun.position, 'x', -100, 100, 1).onChange((value) => {
//   sun.position.x = value;
// });
//
// gui.add(sun.position, 'y', -100, 200, 1).onChange((value) => {
//   sun.position.y = value;
// });
//
// gui.add(params, 'resolution', [240, 360, 480, 720, 1080]).onChange((value) => {
//   effect.resolution.height = Number(value);
// });
//
// gui.add(params, 'blurriness', KernelSize.VERY_SMALL, KernelSize.HUGE + 1, 1).onChange((value) => {
//   effect.blur = value > 0;
//   effect.blurPass.kernelSize = value - 1;
// });
//
// gui.add(params, 'density', 0.0, 1.0, 0.01).onChange((value) => {
//   uniforms.density.value = value;
// });
//
// gui.add(params, 'decay', 0.0, 1.0, 0.01).onChange((value) => {
//   uniforms.decay.value = value;
// });
//
// gui.add(params, 'weight', 0.0, 1.0, 0.01).onChange((value) => {
//   uniforms.weight.value = value;
// });
//
// gui.add(params, 'exposure', 0.0, 1.0, 0.01).onChange((value) => {
//   uniforms.exposure.value = value;
// });
//
// gui.add(params, 'clampMax', 0.0, 1.0, 0.01).onChange((value) => {
//   uniforms.clampMax.value = value;
// });
//
// gui.add(effect, 'samples', 15, 200, 1);
//
// gui.add(params, 'opacity', 0.0, 1.0, 0.01).onChange((value) => {
//   blendMode.opacity.value = value;
// });
