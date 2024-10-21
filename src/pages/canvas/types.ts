import { CatmullRomCurve3, Euler, Group, Mesh, Vector3 } from 'three';

export interface Config {
  name: string;
  position: Vector3;
  scale: Vector3;
  rotation: Euler;
  model: Group;
  mesh: Mesh;
  loadModal: (config: Config) => Promise<void>;
  pointVectorList: Vector3[];
  pointVertices: number[];
  toNextCurves: CatmullRomCurve3[];
  onSwitchOut?: (params: { fromConfig: Config; toConfig: Config }) => Promise<void>;
  onSwitchIn?: (params: { fromConfig: Config; toConfig: Config }) => Promise<void>;
  actions?: any[]; // 动画
}
