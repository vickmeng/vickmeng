import { AnimationFrameSubject, camera, clock, composer, renderer, scene } from '@/pages/home/canvas/core';
import { addModels } from '@/pages/home/canvas/addModels';
import { addBackground } from '@/pages/home/canvas/addBackground';
import { addGrass } from '@/pages/home/canvas/addGrass';
import { addEvil } from '@/pages/home/canvas/addEvil';
import { Vector3 } from 'three';

document.querySelector('#home_bg')!.appendChild(renderer.domElement);

addModels();
addBackground();
addGrass();
addEvil();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

const lookAtPosition = new Vector3(0, 0, 8);

AnimationFrameSubject.asObservable().subscribe(() => {
  const delta = clock.getDelta();
  renderer.render(scene, camera);

  composer.render();
  camera.lookAt(lookAtPosition);

  requestIdleCallback(() => {
    AnimationFrameSubject.next(delta);
  });
});

requestIdleCallback(() => {
  AnimationFrameSubject.next(clock.getDelta());
});
