import { CityConfig } from '@/pages/home/canvas/types';
import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/home/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/home/canvas/utils/utils';
// @ts-ignore
import ship from '../../../../assets/ship.fbx?url';
import { CAMERA_ROTATION_Y, MODEL_POSITION_X } from '@/pages/home/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';
// @ts-ignore
import font from '../../../../assets/朱雀仿宋.ttf?url';

export const qingdaoConfig: CityConfig = {
  name: 'qingdao',
  preColor: new Color(0xff7493),
  UIThemeColor: '#ff7493',
  earthRotation: new Euler(0.46, 3.05, 0),
  cityPosition: new Vector3(-210.14429595033295, 297.0576377962532, -342.9229282308912),
  cameraRotation: new Euler(0, -CAMERA_ROTATION_Y, 0),

  modelPosition: new Vector3(MODEL_POSITION_X, 0, 0),
  modelScale: new Vector3(1, 1, 1).multiplyScalar(0.02),
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
    line.name = 'line';

    scene.add(line);

    mesh.position.set(modelPosition.x, modelPosition.y, modelPosition.z);
    mesh.rotation.set(modelRotation.x, modelRotation.y, modelRotation.z);
    mesh.scale.set(modelScale.x, modelScale.y, modelScale.z);
    // mesh.material = new MeshBasicMaterial({ visible: false });
    mesh.material = new MeshBasicMaterial({ opacity: 0, transparent: true, depthTest: false });
    mesh.name = 'model';
    scene.add(mesh); // 不展示提供点击区域

    config.line = line;
    config.model = model;
    config.mesh = mesh;

    config.pointVectorList = getVectorListFromMesh({ mesh });
    config.pointVertices = getVerticesFromVectors(config.pointVectorList);
  },
  pointVectorList: [],
  pointVertices: [],
  toNextCurves: [],
  getDesc: () => {
    const group = new Group();

    const myText = new Text();

    myText.text =
      '多年以后，面对我带的团队，老孟会回想起同学带我去见识代码的那个遥远的下午。\n\n' +
      '大四那年，室友去软件公司实习，写了俩月Java就回来嚷嚷着要搞H5。\n\n' +
      '“啥是H5？”\n\n' +
      '“给你本书自己看吧。”\n\n' +
      '这样一个随口问题让编程成为了我的主要爱好，命运奇妙。';
    myText.fontSize = 2.3;
    myText.maxWidth = 60;
    myText.lineHeight = 1.2;
    myText.font = font;
    myText.overflowWrap = 'break-word';

    group.position.set(-38, 200, 400);

    group.rotation.set(0, 2 * Math.PI * 0.01, 0);

    group.add(myText);
    group.name = 'desc';

    return group;
  },
};
