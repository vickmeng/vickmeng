import { CityConfig } from '@/pages/timeline/canvas/types';
import * as THREE from 'three';
import { Color, Euler, Group, MathUtils, Mesh, MeshBasicMaterial, Vector3 } from 'three';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { scene } from '@/pages/timeline/canvas/core';
import { getVectorListFromMesh, getVerticesFromVectors } from '@/pages/timeline/canvas/utils/utils';
// @ts-ignore
import ship from '../../../../assets/ship.fbx?url';
import { CAMERA_ROTATION_Y, MODEL_POSITION_X } from '@/pages/timeline/canvas/constants';
// @ts-ignore
import { Text } from 'troika-three-text';
// @ts-ignore
import font from '../../../../assets/朱雀仿宋.ttf?url';
import qingdaoUrl from '@/assets/qingdao.jpg';
export const qingdaoConfig: CityConfig = {
  name: 'qingdao',
  name_cn: '青岛',
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
      '我算是中国比较早的一批街舞舞者，怀揣着对街舞的追求，希望离hiphop文化更发达的日韩近一点，于是去了青岛读大学。\n\n' +
      '人有旦夕祸福，大四那年我的强制性脊柱炎病发，无奈放弃跳舞。\n\n' +
      '好在业余学了一手纹身手艺，也能坐着赚点生活费。每天就是养病，纹身，盘核桃。\n\n' +
      '在大四那年，机缘巧合，室友给了我一本H5相关的书，又多了个写代码的爱好，就是写着玩也没想干这个，没想到现在成了职业。\n\n' +
      '所以说，保持一个骨灰爱好是真的重要~~';

    myText.fontSize = 2.3;
    myText.maxWidth = 60;
    myText.lineHeight = 1.2;
    myText.font = font;
    myText.overflowWrap = 'break-word';

    group.add(myText);

    group.position.set(-38, 200, 400);

    group.name = 'desc';

    return group;
  },
  modelDesc: (
    <>
      <img src={qingdaoUrl} width={'100%'}></img>
      <p>如果选最宜居的城市，我就选青岛，类似地中海气候，非常舒服。</p>
      <p>我在这上了4年大学，后悔海鲜吃少了。</p>
      <p>这个地方真的掏不出什么城市名片，最有名的就是帆船文化，但老百姓是不玩的，不晓得为啥总宣传这个东西。</p>
    </>
  ),
};
