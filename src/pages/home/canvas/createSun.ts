import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';
import { SUN_POSITION_X, SUN_POSITION_Y } from '@/pages/home/canvas/constants';

export const createSun = (): Mesh => {
  const sunMaterial = new MeshBasicMaterial({
    color: 0x64abe3,
    transparent: true,
    fog: false,
    opacity: 0.01,
  });

  const sunGeometry = new SphereGeometry(0.3, 32, 32);
  const sun = new Mesh(sunGeometry, sunMaterial);

  sun.position.set(SUN_POSITION_X, SUN_POSITION_Y, 470);
  return sun;
};
