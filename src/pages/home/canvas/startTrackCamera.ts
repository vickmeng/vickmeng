import { CatmullRomCurve3, Curve, Vector3 } from 'three';
import { Tween } from '@tweenjs/tween.js';
import { AnimationFrameSubject, camera } from '@/pages/home/canvas/core';
import { fadeMaterial } from '@/pages/home/canvas/fadeMaterial';
import { lastValueFrom, Subject, takeUntil } from 'rxjs';
import { loadingStore, playingStore, trackIndexStore } from '@/pages/home/store';

interface Track {
  cameraTrack: Curve<Vector3> | Vector3;
  lensTrack: Curve<Vector3> | Vector3;
}

const tracks: Track[] = [
  {
    cameraTrack: new CatmullRomCurve3([new Vector3(0, 8, 50), new Vector3(0, 1.2, 7.7)]),
    lensTrack: new Vector3(0, 0, 0),
  },

  {
    cameraTrack: new CatmullRomCurve3([new Vector3(50, 6.6, 0), new Vector3(34, 37, 0.0), new Vector3(0, 50, 0.0)]),
    lensTrack: new Vector3(0, 0, 0),
  },
  {
    cameraTrack: new CatmullRomCurve3([new Vector3(-8, 9, -20), new Vector3(0, 13, -26)]),
    lensTrack: new CatmullRomCurve3([new Vector3(0, 9, -30), new Vector3(0, 13, -30)]),
  },
  {
    cameraTrack: new CatmullRomCurve3([
      new Vector3(-15, 20.7, -40),
      new Vector3(-4.1, 22, -41),
      new Vector3(4.7, 20, -42),
      new Vector3(12.7, 15.6, -42.7),
    ]),
    lensTrack: new Vector3(0, 0, 0),
  },
];

// let trackIndex = 0;

const moveTrack = async () => {
  const animateFinish = new Subject();
  const { cameraTrack, lensTrack } = tracks[trackIndexStore.trackIndex];
  const animate$ = AnimationFrameSubject.pipe(takeUntil(animateFinish));

  const params = { t: 0 };

  const tween = new Tween(params)
    .to({ t: 1 }, 15000)
    .onUpdate(() => {
      if (cameraTrack instanceof Curve) {
        camera.position.copy(cameraTrack.getPointAt(params.t));
      } else {
        camera.position.copy(cameraTrack);
      }

      if (lensTrack instanceof Curve) {
        camera.lookAt(lensTrack.getPointAt(params.t));
      } else {
        camera.lookAt(lensTrack);
      }
    })
    .onComplete(() => {
      if (trackIndexStore.trackIndex === tracks.length - 1) {
        trackIndexStore.trackIndex = 0;
      } else {
        trackIndexStore.trackIndex += 1;
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

// const addTrackHelper = () => {
//   trackHelperGroup.clear();
//
//   const { cameraTrack, lensTrack } = tracks[trackIndexStore.trackIndex];
//
//   if (cameraTrack instanceof Curve) {
//     const points = cameraTrack.getPoints(100);
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//
//     const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
//
//     const line = new THREE.Line(geometry, material);
//     trackHelperGroup.add(line);
//   } else {
//     //
//   }
//
//   if (lensTrack instanceof Curve) {
//     const points = lensTrack.getPoints(100);
//     const geometry = new THREE.BufferGeometry().setFromPoints(points);
//     const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
//     const line = new THREE.Line(geometry, material);
//     trackHelperGroup.add(line);
//   } else {
//     const ball = new Mesh(
//       new SphereGeometry(1),
//       new MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.5 })
//     );
//     ball.position.copy(lensTrack);
//     trackHelperGroup.add(ball);
//   }
// };

const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const handleSwitchTrack = async (isStart: boolean) => {
  // addTrackHelper();

  const fadeOutAndDelay = async () => {
    await delay(12000);
    await fadeOut();
  };
  // animationList.push(fadeOutAndDelay);

  await Promise.all([isStart ? undefined : fadeIn(), moveTrack(), fadeOutAndDelay()]);

  await handleSwitchTrack(false);
};

export const startTrackCamera = async () => {
  if (loadingStore.loading) {
    return;
  }

  if (playingStore.playing) {
    return;
  }

  playingStore.playing = true;
  await handleSwitchTrack(true);
};
