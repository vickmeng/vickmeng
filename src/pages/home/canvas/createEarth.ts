import EarthImg from '@/assets/earthNight.jpg';
import * as THREE from 'three';
import { Group, Mesh, TextureLoader } from 'three';
import { EARTH_POSITION_X } from '@/pages/home/canvas/constants';
import { ConfigList } from '@/pages/home/canvas/config';

export const createEarth = async (): Promise<Group> => {
  const texture = await new TextureLoader().load(EarthImg);

  const sphereGeometry = new THREE.SphereGeometry(500, 1000, 1000);

  const vertexShader = `
    // attribute vec2 uv;//默认提供,不用自己写
    varying vec2 vUv;
    void main(){
      vUv = uv;// UV坐标插值计算
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
`;

  const fragmentShader = `
    uniform sampler2D map;//颜色贴图变量
    varying vec2 vUv;

    void main() {
        // 通过几何体的UV坐标从颜色贴图获取像素值
        vec4 texColor;
        texColor = texture2D(map, vUv);
        // gl_FragColor = texColor; 
        float gray = 0.299 * texColor.r + 0.587 * texColor.g + 0.114 * texColor.b;
        gl_FragColor = vec4(gray , gray , gray + 0.015 , 1); 
    }
    `;

  const material = new THREE.ShaderMaterial({
    uniforms: {
      // 给着色器中同名uniform变量map传值
      map: { value: texture },
    },
    vertexShader,
    fragmentShader,
    // wireframe: true,
    // transparent: true,
  });

  const earth = new Mesh(sphereGeometry, material);

  const earthGroup = new Group();

  earthGroup.position.x = EARTH_POSITION_X;
  earthGroup.position.z = -500;
  earthGroup.position.y = 180;

  earthGroup.add(earth);
  return earthGroup;
};
