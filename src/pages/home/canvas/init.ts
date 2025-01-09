import { camera, clock, renderer, scene, controls, AnimationFrameSubject } from '@/pages/home/canvas/core';
import { addModels } from '@/pages/home/canvas/addModels';
import { addBackground } from '@/pages/home/canvas/addBackground';

document.querySelector('#home_bg')!.appendChild(renderer.domElement);

addModels();
addBackground();

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
