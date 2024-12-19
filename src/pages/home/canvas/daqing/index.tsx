import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, Vector3 } from 'three';
// @ts-ignore
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { AnimationFrameSubject, scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';

// @ts-ignore
import pumpjack from '../../../../assets/pumpjack.obj?url';
import { CityConfig } from '@/pages/home/canvas/types';
import { MODEL_POSITION_X } from '@/pages/home/canvas/constants';
import { Text } from 'troika-three-text';
import ThreeMeshUI from 'three-mesh-ui';

export const daqingConfig: CityConfig = {
  name: 'daqing',
  preColor: new Color(0x6be6e0),
  UIThemeColor: '#6be6e0',
  earthRotation: new Euler(0.74, 1.96, 0),

  cityPosition: new Vector3(-223.14059996451869, 352.99110522483477, -274.9646382348542),

  modelPosition: new Vector3(-MODEL_POSITION_X, 0, 0),
  modelScale: new Vector3(0.9, 0.9, 0.9),
  modelRotation: new Euler(0, MathUtils.degToRad(220), 0),
  // @ts-ignore
  mesh: undefined,
  loadModel: async (config: CityConfig) => {
    const { modelPosition, modelScale, modelRotation } = config;

    const loader = new OBJLoader();
    const model = await loader.loadAsync(pumpjack);
    const mesh: Mesh = model.children[0];

    const edges = new THREE.EdgesGeometry(mesh.geometry, 1);
    const line = new THREE.LineSegments(edges);
    line.material = new THREE.LineBasicMaterial({
      color: config.preColor,
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
    config.mesh = mesh;
    config.model = model;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
  getDesc: async () => {
    const group = new Group();
    group.position.set(0, 180, 0);
    group.position.y = 180;

    group.name = 'decs';
    return group;
  },
};
