import { CatmullRomCurve3, Color, Euler, Group, LineSegments, Mesh, Vector3 } from 'three';

export interface CityConfig {
  name: string;
  modelPosition: Vector3;
  modelScale: Vector3;
  modelRotation: Euler;
  model: Group;
  mesh: Mesh;
  line: LineSegments;
  loadModel: (config: CityConfig) => Promise<void>;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextCurves: CatmullRomCurve3[];
  onSwitchOut?: (params: { fromConfig: CityConfig; toConfig: CityConfig }) => Promise<void>;
  onSwitchIn?: (params: { fromConfig: CityConfig; toConfig: CityConfig }) => Promise<void>;
  actions?: any[]; // 动画
  preColor: Color; // 前景色 决定字体等
  UIThemeColor: string; // 和preColor是一样的用于css，preColor的three.js的对象我懒得改了
  cityPosition: Vector3;
  earthRotation: Euler;
  // markQuaternion
  // faceDirection: Vector3;
}
