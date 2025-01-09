import { Euler, Group, MathUtils } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import Praying from '@/assets/Praying.fbx?url';
import * as THREE from 'three';
import { AnimationFrameSubject, clock, scene } from '@/pages/home/canvas/core';

export const addModels = async () => {
  const group = new Group();

  const loader = new FBXLoader();
  const delta = clock.getDelta();
  // const model = await loader.loadAsync(Praying);

  for (let i = 0; i < 2; i++) {
    const model = await loader.loadAsync(Praying);

    console.log(model);

    const people = model.children[1];

    people.receiveShadow = true;
    people.castShadow = true;

    model.position.x = -180;
    model.position.y = -100;
    model.position.z = 700 - i * 240;

    model.rotation.copy(new Euler(0, MathUtils.degToRad(90), 0));

    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(model.animations[0]);

    action.play();
    action.timeScale = 0.1;
    action.paused = true;
    mixer.update(delta);
    group.add(model);
  }

  for (let i = 0; i < 2; i++) {
    const model = await loader.loadAsync(Praying);

    const people = model.children[1];

    people.receiveShadow = true;
    people.castShadow = true;

    model.position.x = 180;
    model.position.y = 70;

    model.position.z = 700 - i * 240;

    model.rotation.copy(new Euler(MathUtils.degToRad(180), MathUtils.degToRad(-90), 0));

    group.add(model);
  }

  scene.add(group);
};
