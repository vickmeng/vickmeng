import { ShaderMaterial } from 'three';

const createBackGroundShaderMaterial = (): ShaderMaterial => {
  const vertexShader = `
        varying vec3 vPosition;
        
        void main() {
            // 将变换前的顶点位置（在模型空间下的位置，你也可以根据需求选择其他空间下的位置信息进行传递）赋值给vPosition变量
            vPosition = position;
            // 进行常规的顶点坐标变换，将顶点位置从模型空间转换到裁剪空间
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `;

  const fragmentShader = `
    varying vec3 vPosition;

    void main() {
        // 这里可以根据拿到的整个顶点位置进行各种操作，以下只是简单示例，比如根据顶点位置的x坐标来设置颜色
        if (vPosition.z > 0.0) {
            gl_FragColor = vec4(0.1176, 0.1020, 0.1451, 0.98);  // 如果x坐标大于0，设置颜色为红色，不透明
        } else {
            gl_FragColor = vec4(0.1176, 0.1020, 0.1451, 1.0);  // 这里示例设置为绿色，你可以根据需求修改
        }
        // 你还可以进行更复杂的计算，比如利用顶点位置计算纹理坐标、进行光照效果基于位置的调整等等，根据具体需求发挥
    }
    `;
  // varying vec3 vPosition;
  // void main() {
  //     if(vPosition.z > 0.0) {
  //         gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  //     } else {
  //         gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  //     }
  // }
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    wireframe: true,
  });
};
export default createBackGroundShaderMaterial;
