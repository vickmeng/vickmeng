import { BufferGeometry, BoxGeometry, SphereGeometry, Vector3 } from 'three';

export interface Config {
  id: string;
  preId?: string;
  nextId?: string;
  position: Vector3;
  model: BufferGeometry;
}

export const ConfigMap: Record<string, Config> = {
  '1': {
    id: '1',
    preId: undefined,
    nextId: '2',
    position: new Vector3(-600, 0, 0),
    model: new BoxGeometry(100, 100, 100, 10, 10, 10),
  },

  '2': {
    id: '2',
    preId: '1',
    nextId: undefined,
    position: new Vector3(30, 0, 0),
    model: new SphereGeometry(80, 60, 60),
  },
};
