import { Mesh, BoxGeometry, SphereGeometry, Vector3 } from 'three';
import * as THREE from 'three';

export interface Config {
  id: string;
  preId?: string;
  nextId?: string;
  position: Vector3;
  mesh: Mesh;
}

export const ConfigMap: Record<string, Config> = {
  '1': {
    id: '1',
    preId: undefined,
    nextId: '2',
    position: new Vector3(-600, 0, 0),
    mesh: new THREE.Mesh(
      new BoxGeometry(100, 100, 100, 10, 10, 10),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    ),
  },

  '2': {
    id: '2',
    preId: '1',
    nextId: undefined,
    position: new Vector3(30, 0, 0),
    mesh: new THREE.Mesh(
      new SphereGeometry(80, 60, 60),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    ),
  },
};
