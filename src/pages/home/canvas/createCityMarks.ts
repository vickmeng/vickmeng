import { ConfigList } from '@/pages/home/canvas/config';
import { Mesh, MeshBasicMaterial, SphereGeometry } from 'three';

export const createCityMarks = () => {
  return ConfigList.map((config) => {
    const geometry = new SphereGeometry(10, 10);

    const material = new MeshBasicMaterial({ color: 0xff0000 });

    const mesh = new Mesh(geometry, material);

    mesh.position.set(config.cityPosition.x, config.cityPosition.y, config.cityPosition.z);
    return mesh;
  });
};
