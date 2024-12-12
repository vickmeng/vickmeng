import { Vector3 } from 'three';

export const getTriangleMidPoint = (vertices: Float32Array): Vector3 => {
  const x = (vertices[0] + vertices[3] + vertices[6]) / 3;
  const y = (vertices[1] + vertices[4] + vertices[7]) / 3;
  const z = (vertices[2] + vertices[5] + vertices[8]) / 3;

  return new Vector3(x, y, z);
};
