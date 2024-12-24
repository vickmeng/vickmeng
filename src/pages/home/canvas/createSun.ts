import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { SUN_POSITION_X, SUN_POSITION_Y } from '@/pages/home/canvas/constants';
import { GodRaysEffect, KernelSize } from 'postprocessing';
import { camera } from '@/pages/home/canvas/core';

export const createSun = () => {
  const sunMaterial = new MeshBasicMaterial({
    color: 0x64abe3,
    transparent: true,
    fog: false,
    opacity: 0.01,
  });

  const sunGeometry = new SphereGeometry(0.3, 32, 32);
  const sun = new Mesh(sunGeometry, sunMaterial);

  sun.position.set(SUN_POSITION_X, SUN_POSITION_Y, 470);

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

  return { sun, sunGodRaysEffect: godRaysEffect };
};
