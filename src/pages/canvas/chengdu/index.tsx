import { Config } from '@/pages/canvas/types';
import { Euler, MathUtils, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import * as THREE from 'three';
import { scene } from '@/pages/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/canvas/utils';
// @ts-ignore
import mark from '../../../assets/mark.fbx?url';
import { MODEL_COLOR } from '@/pages/canvas/constants';

export const chengduConfig: Config = {
  name: 'chengdu',
  position: new Vector3(1000, 450, 0),
  scale: new Vector3(1, 1, 1).multiplyScalar(150),
  rotation: new Euler(MathUtils.degToRad(-90), 0, MathUtils.degToRad(145)),
  // @ts-ignore
  mesh: undefined,
  loadModal: async (config: Config) => {
    const { position, scale, rotation } = config;

    const loader = new FBXLoader();
    const model = await loader.loadAsync(mark);
    const mesh = model.children[0];

    config.model = model;
    config.mesh = mesh;

    mesh.material = new THREE.MeshBasicMaterial({ color: MODEL_COLOR, transparent: true, wireframe: true });
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    mesh.scale.set(scale.x, scale.y, scale.z);

    // model.position.set(position.x, position.y, position.z);
    // model.rotation.set(rotation.x, rotation.y, rotation.z);
    // model.scale.set(scale.x, scale.y, scale.z);

    scene.add(mesh);

    // const transformControls = new TransformControls(camera, renderer.domElement);
    // scene.add(transformControls);
    // transformControls.attach(mesh);

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);

    // model.mixer = new THREE.AnimationMixer(model);
  },
  // onSwitchIn: (params) => {
  //   const { animations } = params.toConfig.model;
  //   // @ts-ignore
  //   const mixer = params.toConfig.model.mixer as AnimationMixer;
  //
  //   const action = mixer.clipAction(animations[0]);
  //   action.play();
  //
  //   AnimationFrameSubject.pipe(takeUntil(SwitchSubject)).subscribe({
  //     next: () => {
  //       const delta = clock.getDelta();
  //       mixer.update(delta);
  //       renderer.render(scene, camera);
  //     },
  //     complete: () => {
  //       mixer.stopAllAction();
  //     },
  //   });
  //
  //   return Promise.resolve();
  // },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
};
