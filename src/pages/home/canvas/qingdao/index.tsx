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
      '我在青岛读的大学。\n' +
      '从来没考虑过编程能和我产生半点联系，直到大四，有个室友去软件公司实习，写了俩月Java就回来嚷嚷着要学H5。\n\n' +
      '“啥是H5？”\n\n' +
      '“给你本书自己看吧。”\n\n' +
      '缘，妙不可言。\n\n' +
      '我实习期岗位并非程序员，而是在大连的一家编程培训机构当客服。' +
      '我意外发现那些毕业学员的水平远不及我，于是乎自己也开启了程序员的职业生涯。';

    myText.fontSize = 2.3;
    myText.maxWidth = 60;
    myText.lineHeight = 1.2;
    myText.font = font;
    myText.overflowWrap = 'break-word';

    group.position.set(-38, 200, 400);

    group.rotation.set(0, 2 * Math.PI * 0.01, 0);

    group.add(myText);
    group.name = 'desc';

    // const gui = new GUI();
    //
    // gui.add(group.position, 'x', -100, 100, 1).onChange((value) => {
    //   group.position.x = value;
    // });
    // gui.add(group.position, 'y', 100, 400, 1).onChange((value) => {
    //   group.position.y = value;
    // });
    //
    // gui.add(group.rotation, 'x', 0, 2 * Math.PI, 0.01).onChange((value) => {
    //   group.rotation.x = value;
    // });
    // gui.add(group.rotation, 'y', 0, 2 * Math.PI, 0.01).onChange((value) => {
    //   group.rotation.y = value;
    // });
    // gui.add(group.rotation, 'z', 0, 2 * Math.PI, 0.01).onChange((value) => {
    //   group.rotation.z = value;
    // });

    return group;
  },
};
