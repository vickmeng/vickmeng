import { ShaderMaterial } from 'three';

const customFadeShader = {
  uniforms: {
    fadeFactor: { value: 0 },
    tDiffuse: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float fadeFactor;
    varying vec2 vUv;
    void main() {
      vec4 originalColor = texture2D(tDiffuse, vUv);
      vec4 blackColor = vec4(0.0, 0.0, 0.0, 1.0);
      // 根据fadeFactor来线性混合原始颜色
      gl_FragColor =  mix(originalColor, blackColor, fadeFactor);
      
    }`,
};
export const fadeMaterial = new ShaderMaterial(customFadeShader);
