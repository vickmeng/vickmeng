import * as THREE from 'three';
import { Color, Euler, MathUtils, Mesh, Vector3 } from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';

// @ts-ignore
import pumpjack from '../../../../assets/pumpjack.obj?url';
import { Config } from '@/pages/home/canvas/types';
import { MODEL_POSITION_X } from '@/pages/home/canvas/constants';

export const daqingConfig: Config = {
  name: 'daqing',
  preColor: new Color(0x6be6e0),

  position: new Vector3(-MODEL_POSITION_X, 0, 0),
  scale: new Vector3(0.9, 0.9, 0.9),
  rotation: new Euler(0, MathUtils.degToRad(220), 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new OBJLoader();
    const model = await loader.loadAsync(pumpjack);
    const mesh: Mesh = model.children[0];

    const edges = new THREE.EdgesGeometry(mesh.geometry, 1);
    const line = new THREE.LineSegments(edges);
    line.material = new THREE.LineBasicMaterial({
      color: config.preColor,
      depthTest: true,
      transparent: true,
    });

    line.position.set(position.x, position.y, position.z);
    line.rotation.set(rotation.x, rotation.y, rotation.z);
    line.scale.set(scale.x, scale.y, scale.z);

    scene.add(line);

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    config.line = line;
    config.mesh = mesh;
    config.model = model;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
