import grass from '@/assets/grass.jpg';
import cloud from '@/assets/cloud.jpg';
import {
  BufferAttribute,
  BufferGeometry,
  DoubleSide,
  Mesh,
  RepeatWrapping,
  ShaderMaterial,
  TextureLoader,
  Vector3,
} from 'three';
import { AnimationFrameSubject, scene } from '@/pages/home/canvas/core';
// https://smythdesign.com/blog/stylized-grass-webgl/
// Parameters
const PLANE_SIZE = 80;
const BLADE_COUNT = 200000;
const BLADE_WIDTH = 0.1;
const BLADE_HEIGHT = 0.8;
const BLADE_HEIGHT_VARIATION = 0.6;

const textureLoader = new TextureLoader();

const grassTexture = await textureLoader.loadAsync(grass);
const cloudTexture = await textureLoader.loadAsync(cloud);

cloudTexture.wrapS = cloudTexture.wrapT = RepeatWrapping;

// Time Uniform
const startTime = Date.now();
const timeUniform = { type: 'f', value: 0.0 };

const grassUniforms = {
  textures: { value: [grassTexture, cloudTexture] },
  iTime: timeUniform,
};

const grassMaterial = new ShaderMaterial({
  uniforms: grassUniforms,
  vertexShader: `varying vec2 vUv;
varying vec2 cloudUV;

varying vec3 vColor;
uniform float iTime;

void main() {
  vUv = uv;
  cloudUV = uv;
  vColor = color;
  vec3 cpos = position;

  float waveSize = 10.0f;
  float tipDistance = 0.3f;
  float centerDistance = 0.1f;

  if (color.x > 0.6f) {
    cpos.x += sin((iTime / 500.) + (uv.x * waveSize)) * tipDistance;
  }else if (color.x > 0.0f) {
    cpos.x += sin((iTime / 500.) + (uv.x * waveSize)) * centerDistance;
  }

  float diff = position.x - cpos.x;
  cloudUV.x += iTime / 20000.;
  cloudUV.y += iTime / 10000.;

  vec4 worldPosition = vec4(cpos, 1.);
  vec4 mvPosition = projectionMatrix * modelViewMatrix * vec4(cpos, 1.0);
  gl_Position = mvPosition;
}
`,
  fragmentShader: `
uniform sampler2D texture1;
uniform sampler2D textures[4];

varying vec2 vUv;
varying vec2 cloudUV;
varying vec3 vColor;

void main() {
  float contrast = 1.5;
  float brightness = 0.1;
  vec3 color = texture2D(textures[0], vUv).rgb * contrast;
  // color = color + vec3(brightness, brightness, brightness);
  color = mix(color, texture2D(textures[1], cloudUV).rgb, 0.4);
  
  float gray = 0.299*color.r+0.587*color.g+0.114*color.b;

  gl_FragColor = vec4(gray,gray,gray,1);
}
`,
  vertexColors: true,
  side: DoubleSide,
});

function convertRange(val: number, oldMin: number, oldMax: number, newMin: number, newMax: number) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin;
}

function generateBlade(center: Vector3, vArrOffset: number, uv: number[]) {
  const MID_WIDTH = BLADE_WIDTH * 0.5;
  const TIP_OFFSET = 0.1;
  const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION;

  const yaw = Math.random() * Math.PI * 2;
  const yawUnitVec = new Vector3(Math.sin(yaw), 0, -Math.cos(yaw));
  const tipBend = Math.random() * Math.PI * 2;
  const tipBendUnitVec = new Vector3(Math.sin(tipBend), 0, -Math.cos(tipBend));

  // Find the Bottom Left, Bottom Right, Top Left, Top right, Top Center vertex positions
  const bl = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * 1));
  const br = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((BLADE_WIDTH / 2) * -1));
  const tl = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * 1));
  const tr = new Vector3().addVectors(center, new Vector3().copy(yawUnitVec).multiplyScalar((MID_WIDTH / 2) * -1));
  const tc = new Vector3().addVectors(center, new Vector3().copy(tipBendUnitVec).multiplyScalar(TIP_OFFSET));

  tl.y += height / 2;
  tr.y += height / 2;
  tc.y += height;

  // Vertex Colors
  const black = [0, 0, 0];
  const gray = [0.5, 0.5, 0.5];
  const white = [1.0, 1.0, 1.0];

  const verts = [
    { pos: bl.toArray(), uv, color: black },
    { pos: br.toArray(), uv, color: black },
    { pos: tr.toArray(), uv, color: gray },
    { pos: tl.toArray(), uv, color: gray },
    { pos: tc.toArray(), uv, color: white },
  ];

  const indices = [
    vArrOffset,
    vArrOffset + 1,
    vArrOffset + 2,
    vArrOffset + 2,
    vArrOffset + 4,
    vArrOffset + 3,
    vArrOffset + 3,
    vArrOffset,
    vArrOffset + 2,
  ];

  return { verts, indices };
}

export function addGrass() {
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  const colors: number[] = [];

  for (let i = 0; i < BLADE_COUNT; i++) {
    const VERTEX_COUNT = 5;
    const surfaceMin = (PLANE_SIZE / 2) * -1;
    const surfaceMax = PLANE_SIZE / 2;
    const radius = PLANE_SIZE / 2;

    const r = radius * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    const pos = new Vector3(x, 0, y);

    const uv = [convertRange(pos.x, surfaceMin, surfaceMax, 0, 1), convertRange(pos.z, surfaceMin, surfaceMax, 0, 1)];

    const blade = generateBlade(pos, i * VERTEX_COUNT, uv);
    blade.verts.forEach((_vert) => {
      positions.push(..._vert.pos);
      uvs.push(..._vert.uv);
      colors.push(..._vert.color);
    });
    blade.indices.forEach((indice) => indices.push(indice));
  }

  const geom = new BufferGeometry();
  geom.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geom.setAttribute('uv', new BufferAttribute(new Float32Array(uvs), 2));
  geom.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3));
  geom.setIndex(indices);
  geom.computeVertexNormals();
  // geom.computeFaceNormals();
  // const groundGeometry = new PlaneGeometry(2500, 2000, 2500, 2000);
  // groundGeometry.rotateX(-0.5 * Math.PI);

  const mesh = new Mesh(geom, grassMaterial);
  // const mesh = new Mesh(groundGeometry, grassMaterial);
  scene.add(mesh);

  AnimationFrameSubject.asObservable().subscribe(() => {
    const elapsedTime = Date.now() - startTime;
    grassUniforms.iTime.value = elapsedTime;
  });
}
