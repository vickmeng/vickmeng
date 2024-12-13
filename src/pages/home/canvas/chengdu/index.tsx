import { Config } from '@/pages/home/canvas/types';
import * as THREE from 'three';
import { Color, Euler, MathUtils, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';
// @ts-ignore
import mark from '../../../../assets/mark.fbx?url';
import { MODEL_POSITION_X } from '@/pages/home/canvas/constants';

export const chengduConfig: Config = {
  name: 'chengdu',
  preColor: new Color(0x55da99),

  earthRotation: new Euler(0.4, 2.51, 0),

  faceDirection: new Vector3(-0.2212816897507219, 0.5130871570187165, -0.8293226049514846),
  cityPosition: new Vector3(-110.64084487536095, 256.54357850935827, -414.6613024757423),

  modelPosition: new Vector3(MODEL_POSITION_X, 180, 0),
  modelScale: new Vector3(1, 1, 1).multiplyScalar(50),
  modelRotation: new Euler(MathUtils.degToRad(-90), 0, MathUtils.degToRad(-20)),
  // @ts-ignore
  mesh: undefined,
  loadModel: async (config: Config) => {
    const { modelPosition, modelScale, modelRotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(mark);
    const mesh = model.children[0];

    const edges = new THREE.EdgesGeometry(mesh.geometry, 1);
    const line = new THREE.LineSegments(edges);
    line.material = new THREE.LineBasicMaterial({
      color: config.preColor,
      depthTest: true,
      transparent: true,
    });

    line.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    line.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    line.scale.set(modelScale.x, modelScale.y, modelScale.z);

    scene.add(line);

    mesh.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    mesh.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);

    config.line = line;
    config.model = model;
    config.mesh = mesh;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },

  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
