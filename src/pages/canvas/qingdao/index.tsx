import { Config } from '@/pages/canvas/types';
import { Euler, Mesh, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { scene } from '@/pages/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';
// @ts-ignore
import ship from '../../../assets/ship.fbx?url';
import { MODEL_COLOR } from '@/pages/canvas/constants';

export const qingdaoConfig: Config = {
  name: 'qingdao',
  position: new Vector3(1000, 0, 0),
  scale: new Vector3(0.05, 0.05, 0.05),
  rotation: new Euler(0, 0, 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(ship);
    const mesh = model.children[1].children[0] as Mesh;

    config.model = model;
    config.mesh = mesh;

    mesh.material = new THREE.MeshBasicMaterial({ color: MODEL_COLOR, transparent: true, wireframe: true });
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
