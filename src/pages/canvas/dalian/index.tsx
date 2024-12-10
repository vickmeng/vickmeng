import { Config } from '@/pages/canvas/types';
import * as THREE from 'three';
import { Color, Euler, MathUtils, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';
// @ts-ignore
import bridge from '../../../assets/bridge.fbx?url';

export const dalianConfig: Config = {
  name: 'dalian',
  preColor: new Color(0xaf375a),
  backColor: new Color(0x60c794),
  position: new Vector3(-1100, 200, 0),
  scale: new Vector3(24, 2.5, 95.4),
  rotation: new Euler(0, MathUtils.degToRad(160), 0),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(bridge);
    const mesh = model.children[0];

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
    config.model = model;
    config.mesh = mesh;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
