import { camera, clock, renderer, scene, controls, AnimationFrameSubject } from '@/pages/home/canvas/core';
import { addModels } from '@/pages/home/canvas/addModels';
import { addBackground } from '@/pages/home/canvas/addBackground';
import { generateField } from '@/pages/home/canvas/addGrass';

document.querySelector('#home_bg')!.appendChild(renderer.domElement);

addModels();
addBackground();
generateField();

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  // camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize);

AnimationFrameSubject.asObservable().subscribe(() => {
  const delta = clock.getDelta();
  renderer.render(scene, camera);
  // composer.render();
  controls.update(delta);
  requestIdleCallback(() => {
    AnimationFrameSubject.next(delta);
  });
});

requestIdleCallback(() => {
  AnimationFrameSubject.next(clock.getDelta());
});
