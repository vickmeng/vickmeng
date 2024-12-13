import { CatmullRomCurve3, Color, Euler, Group, LineSegments, Mesh, Vector3 } from 'three';

export interface Config {
  name: string;
  modelPosition: Vector3;
  modelScale: Vector3;
  modelRotation: Euler;
  model: Group;
  mesh: Mesh;
  line: LineSegments;
  loadModel: (config: Config) => Promise<void>;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextCurves: CatmullRomCurve3[];
  onSwitchOut?: (params: { fromConfig: Config; toConfig: Config }) => Promise<void>;
  onSwitchIn?: (params: { fromConfig: Config; toConfig: Config }) => Promise<void>;
  actions?: any[]; // 动画
  preColor: Color; // 前景色 决定字体等
  cityPosition: Vector3;
  earthRotation: Euler;
  // markQuaternion
  // faceDirection: Vector3;
}
