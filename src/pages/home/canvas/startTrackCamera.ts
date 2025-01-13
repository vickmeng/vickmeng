// import { Vector3 } from 'three';
// import { AnimationFrameSubject, camera } from './core';
// import { Easing, Tween } from '@tweenjs/moveCameraTween.js';
//

import { CatmullRomCurve3, Vector3 } from 'three';
import { Tween } from '@tweenjs/tween.js';
import { AnimationFrameSubject, camera } from '@/pages/home/canvas/core';
import { fadeMaterial } from '@/pages/home/canvas/fadeMaterial';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';

const moveCameraTracks: CatmullRomCurve3[] = [
  new CatmullRomCurve3([new Vector3(0, 8, 50), new Vector3(0, 1.2, 7.7)]),
  new CatmullRomCurve3([new Vector3(-5, 6.9, 50), new Vector3(-4.947714954383741, 4, 45.8), new Vector3(-6, 3.54, 40)]),
  new CatmullRomCurve3([new Vector3(50, 6.6, 0), new Vector3(34, 37, 0.0), new Vector3(0, 50, 0.0)]),
  new CatmullRomCurve3([
    new Vector3(12.7, 15.6, -42.7),
    new Vector3(4.7, 20, -42),
    new Vector3(-4.1, 22, -41),
    new Vector3(-15, 20.7, -40),
  ]),
];

let trackIndex = 0;

const move = async () => {
  const animateFinish = new Subject();
  const track = moveCameraTracks[trackIndex];

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const params = { t: 0 };

  const tween = new Tween(params)
    .to({ t: 1 }, 15000)
    .onUpdate(() => {
      camera.position.copy(track.getPointAt(params.t));
      camera.lookAt(new Vector3(0, 0, 0));
    })
    .onComplete(() => {
      if (trackIndex === moveCameraTracks.length - 1) {
        trackIndex = 0;
      } else {
        trackIndex += 1;
      }
      animateFinish.next(undefined);
    })
    .start();

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });

  await lastValueFrom(animate$);
};

const fadeIn = async () => {
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const params = { t: 1 };

  const tween = new Tween(params)
    .to({ t: 0 }, 3000)
    .onUpdate(() => {
      fadeMaterial.uniforms.fadeFactor.value = params.t;
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start();

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });

  await lastValueFrom(animate$);
};

const fadeOut = async () => {
  const animateFinish = new Subject();

  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const params = { t: 0 };

  const tween = new Tween(params)
    .to({ t: 1 }, 3000)
    .onUpdate(() => {
      fadeMaterial.uniforms.fadeFactor.value = params.t;
    })
    .onComplete(() => {
      animateFinish.next(undefined);
    })
    .start();

  animate$.subscribe({
    next: () => {
      tween.update();
    },
    complete: () => {
      tween.stop();
    },
  });

  await lastValueFrom(animate$);
};

export const startTrackCamera = async () => {
  fadeIn();
  await move();

  setTimeout(fadeOut, 11000);

  startTrackCamera();
};
