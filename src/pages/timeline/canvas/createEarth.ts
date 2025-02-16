import EarthImg from '@/assets/earthNight.jpg';
import * as THREE from 'three';
import { CatmullRomCurve3, CircleGeometry, Group, Mesh, MeshBasicMaterial, ShaderMaterial, TextureLoader } from 'three';
import { EARTH_POSITION_X } from '@/pages/timeline/canvas/constants';
import { CityConfigList } from '@/pages/timeline/canvas/cityConfig';
import { KernelSize, OutlineEffect } from 'postprocessing';
import { AnimationFrameSubject, camera, scene } from '@/pages/timeline/canvas/core';
import { currentIndexStore, switchModelProcessStore } from '@/pages/timeline/store';

export const createEarth = async () => {
  const earthGroup = new Group();
  /**
   * 创建地球 start
   */

  const texture = await new TextureLoader().load(EarthImg);

  const sphereGeometry = new THREE.SphereGeometry(500, 100, 100);

  const material = new THREE.MeshPhongMaterial({
    map: texture,
  });

  const earth = new Mesh(sphereGeometry, material);
  earth.receiveShadow = true;
  earth.castShadow = true;

  earthGroup.position.x = EARTH_POSITION_X;
  earthGroup.position.z = -500;
  earthGroup.position.y = 180;

  earthGroup.add(earth);

  const outlineEffect = new OutlineEffect(scene, camera, {
    resolutionX: 240,
    resolutionY: 240,
    edgeStrength: 1.5,
    pulseSpeed: 0.25,
    kernelSize: KernelSize.HUGE,
    visibleEdgeColor: 0x64abe3,
    hiddenEdgeColor: 0x64abe3,
    blur: true,
  });
  outlineEffect.blendMode.opacity = new THREE.Uniform(0.2);
  outlineEffect.selection.set([earth]);

  /**
   * 创建地球 end
   */

  /**
   * 创建高亮光 start
   */
  const cityHighLights = CityConfigList.map((config) => {
    const _geometry = new CircleGeometry(16);

    const _material = new ShaderMaterial({
      transparent: true,
      depthTest: false,
      uniforms: {
        color: {
          value: CityConfigList[0].preColor,
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

    const mesh = new Mesh(_geometry, _material);

    mesh.position.set(config.cityPosition.x, config.cityPosition.y, config.cityPosition.z);

    const relativeVector = new THREE.Vector3();
    relativeVector.subVectors(mesh.position, earth.position);
    relativeVector.normalize();

    const defaultNormal = new THREE.Vector3(0, 0, 1);

    const axis = new THREE.Vector3();
    axis.crossVectors(defaultNormal, relativeVector).normalize();

    const angle = defaultNormal.angleTo(relativeVector);
    const rotationQuaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

    mesh.quaternion.copy(rotationQuaternion);

    mesh.name = 'cityHighLight';

    return mesh;
  });
  earthGroup.add(...cityHighLights);

  AnimationFrameSubject.asObservable().subscribe((delta) => {
    // 高亮当前城市
    const activeIndex = switchModelProcessStore.process?.toIndex ?? currentIndexStore.currentIndex;
    // 当前城市大一点
    if (cityHighLights[activeIndex].scale.x > 2) {
      cityHighLights.forEach((_cityMark) => {
        _cityMark.scale.x = 0;
        _cityMark.scale.y = 0;
      });
    } else {
      cityHighLights.forEach((_cityMark, index) => {
        if (index === activeIndex) {
          _cityMark.scale.x += delta * 1.2;
          _cityMark.scale.y += delta * 1.2;
        } else {
          _cityMark.scale.x += delta * 0.3;
          _cityMark.scale.y += delta * 0.3;
        }
      });
    }
  });

  /**
   * 创建高亮光 end
   */

  /**
   * 创建城市点 start
   */
  const cityPoints = CityConfigList.map((config) => {
    const _geometry = new THREE.SphereGeometry(2);

    const _material = new MeshBasicMaterial({ color: CityConfigList[0].preColor, transparent: true });
    _material.opacity = 0.5;

    const mesh = new Mesh(_geometry, _material);

    mesh.position.set(config.cityPosition.x, config.cityPosition.y, config.cityPosition.z);

    mesh.name = 'cityPoint';

    return mesh;
  });
  earthGroup.add(...cityPoints);

  /**
   * 创建城市点 end
   */

  /**
   * 创建飞线 start
   */

  CityConfigList.forEach((config, index) => {
    if (index === 0) {
      //
    } else {
      const fromConfig = CityConfigList[index - 1];
      const toConfig = CityConfigList[index];

      const fromVector = new THREE.Vector3();
      fromVector.subVectors(fromConfig.cityPosition, earth.position);
      fromVector.normalize();

      const toVector = new THREE.Vector3();
      toVector.subVectors(toConfig.cityPosition, earth.position);
      toVector.normalize();

      const midPointVector = fromVector.clone().add(toVector).normalize();
      const midPosition = earth.position.clone().add(midPointVector).multiplyScalar(520);

      const _toNextCurve = new CatmullRomCurve3([fromConfig.cityPosition, midPosition, toConfig.cityPosition]);
      const _toNextGeometry = new THREE.TubeGeometry(_toNextCurve, 20, 2, 8, false);
      const _material = new THREE.ShaderMaterial({
        transparent: true,
        depthTest: false,
        uniforms: {
          color: {
            value: CityConfigList[0].preColor,
          },
          x: {
            value: 0.0,
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
          varying vec2 vUv;
          uniform vec3 color;
          uniform float x;
          void main() {
              if(vUv.x < x && vUv.x > x - 0.5){
                float per = 1.0 - (x-vUv.x) / 0.5;//范围0~1
                gl_FragColor = vec4(color, per);
              }else{
                discard;
              }
          }
        `,
      });
      const toNextFlyLine = new THREE.Mesh(_toNextGeometry, _material);

      toNextFlyLine.name = 'toNextFlyLine';
      toNextFlyLine.visible = false;
      earthGroup.add(toNextFlyLine);

      const _toPreCurve = new CatmullRomCurve3([toConfig.cityPosition, midPosition, fromConfig.cityPosition]);
      const _toPreGeometry = new THREE.TubeGeometry(_toPreCurve, 20, 2, 8, false);

      const toPreFlyLine = new THREE.Mesh(_toPreGeometry, _material.clone());
      toPreFlyLine.name = 'toPreFlyLine';
      toPreFlyLine.visible = false;
      earthGroup.add(toPreFlyLine);
    }
  });

  /**
   * 创建飞线 end
   */

  return { earthGroup, earthOutlineEffect: outlineEffect };
};
