import { Config } from '@/pages/home/canvas/types';
import { Color, Euler, Mesh, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils';
// @ts-ignore
import ship from '../../../../assets/ship.fbx?url';

export const qingdaoConfig: Config = {
  name: 'qingdao',
  preColor: new Color(0xe1dfd8),
  backColor: new Color(0xd34752),
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
