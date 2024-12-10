import { Euler, MathUtils, Mesh, Vector3 } from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';
import { scene } from '@/pages/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';

// @ts-ignore
import pumpjack from '../../../assets/pumpjack.obj?url';
import { Config } from '@/pages/canvas/types';
import { MODEL_COLOR } from '@/pages/canvas/constants';

export const daqingConfig: Config = {
  name: 'daqing',
  position: new Vector3(-1000, 0, 0),
  scale: new Vector3(2, 2, 2),
  rotation: new Euler(0, MathUtils.degToRad(190), 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new OBJLoader();
    const model = await loader.loadAsync(pumpjack);
    const mesh: Mesh = model.children[0];

    config.model = model;
    config.mesh = mesh;

    // console.log('mesh', mesh.geometry);

    // const edges = new THREE.EdgesGeometry(mesh.geometry, 1);
    // const line = new THREE.LineSegments(edges);
    // line.material = new THREE.LineBasicMaterial({
    //   color: new THREE.Color('#0fb1fb'),
    //   depthTest: true,
    //   transparent: true,
    // });
    //
    // line.position.set(position.x, position.y, position.z);
    // line.rotation.set(rotation.x, rotation.y, rotation.z);
    // line.scale.set(scale.x, scale.y, scale.z);
    //
    // scene.add(line);

    mesh.material = new THREE.MeshBasicMaterial({
      color: MODEL_COLOR,
      transparent: true,
      wireframe: true,
    });

    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    config.model = model;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
