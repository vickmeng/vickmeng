import { CityConfig } from '@/pages/home/canvas/types';
import { Color, Euler, MathUtils, Mesh, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';
// @ts-ignore
import ship from '../../../../assets/ship.fbx?url';
import { MODEL_POSITION_X } from '@/pages/home/canvas/constants';

export const qingdaoConfig: CityConfig = {
  name: 'qingdao',
  preColor: new Color(0xff7493),
  earthRotation: new Euler(0.46, 3.05, 0),

  cityPosition: new Vector3(-210.14429595033295, 297.0576377962532, -342.9229282308912),

  modelPosition: new Vector3(MODEL_POSITION_X, 0, 0),
  modelScale: new Vector3(0.015, 0.015, 0.015),
  modelRotation: new Euler(0, MathUtils.degToRad(100), 0),
  // @ts-ignore
  mesh: undefined,
  loadModel: async (config: CityConfig) => {
    const { modelPosition, modelScale, modelRotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(ship);
    const mesh = model.children[1].children[0] as Mesh;

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
    config.model = model;
    config.mesh = mesh;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
