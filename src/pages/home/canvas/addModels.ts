import * as THREE from 'three';
import { Euler, Group, MathUtils, Mesh, MeshPhongMaterial, TextureLoader } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import SpaceMan from '@/assets/spaceMan.fbx?url';
import { clock, scene } from '@/pages/home/canvas/core';
import AstronautMap from '@/assets/Astronaut_D.jpg';

export const addModels = async () => {
  const delta = clock.getDelta();
  const group = new Group();

  const loader = new FBXLoader();
  const textureLoader = new TextureLoader();
  // const model = await loader.loadAsync(Praying);

  const AstronautTexture = await textureLoader.loadAsync(AstronautMap);

  for (let i = 0; i < 8; i++) {
    const model = await loader.loadAsync(SpaceMan);

    const people = model.children[0] as Mesh;
    (people.material as MeshPhongMaterial).map = AstronautTexture;

    people.receiveShadow = true;
    people.castShadow = true;

    model.position.x = -8;
    model.position.y = -3;
    model.position.z = 38 - i * 8;
    model.scale.set(4, 4, 4);
    model.rotation.copy(new Euler(0, MathUtils.degToRad(90), 0));

    const mixer = new THREE.AnimationMixer(model);
    const action = mixer.clipAction(model.animations[0]);

    action.play();
    action.timeScale = 0.1;
    action.paused = true;
    mixer.update(delta);
    group.add(model);
  }

  for (let i = 0; i < 8; i++) {
    const model = await loader.loadAsync(SpaceMan);

    const people = model.children[0] as Mesh;
    (people.material as MeshPhongMaterial).map = AstronautTexture;

    people.receiveShadow = true;
    people.castShadow = true;

    model.position.x = 8;
    model.position.y = -1;
    model.position.z = 38 - i * 8;
    model.scale.set(4, 4, 4);

    model.rotation.copy(new Euler(MathUtils.degToRad(180), MathUtils.degToRad(-90), 0));

    group.add(model);
  }

  scene.add(group);
};
