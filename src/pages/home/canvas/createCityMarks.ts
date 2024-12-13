import { ConfigList } from '@/pages/home/canvas/config';
import { CircleGeometry, Mesh, ShaderMaterial } from 'three';

export const createCityMarks = () => {
  return ConfigList.map((config) => {
    const geometry = new CircleGeometry(16);

    const material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        color: {
          value: ConfigList[0].preColor,
        },
      },
      vertexShader: `
      varying vec2 vUv;  
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      } 
    `,
      fragmentShader: `
      uniform vec3 color;
     
      varying vec2 vUv;  
      void main() {
        float radius = length(vUv - 0.5); // uv坐标到中心的距离
        float alpha = smoothstep(0.1, 0.8, radius);
        gl_FragColor = vec4(color, alpha);
      }
    `,
    });

    const mesh = new Mesh(geometry, material);

    mesh.position.set(config.cityPosition.x, config.cityPosition.y, config.cityPosition.z);

    mesh.name = 'cityMark';

    return mesh;
  });
};
