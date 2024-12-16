import { CatmullRomCurve3, Vector3 } from 'three';
import { CityConfig } from '@/pages/home/canvas/types';
import { daqingConfig } from '@/pages/home/canvas/daqing';
import { qingdaoConfig } from '@/pages/home/canvas/qingdao';
import { dalianConfig } from '@/pages/home/canvas/dalian';
import { chengduConfig } from '@/pages/home/canvas/chengdu';

//

export const CityConfigList: CityConfig[] = [daqingConfig, qingdaoConfig, dalianConfig, chengduConfig];

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = () => {
  // 率先计算所有曲线
  CityConfigList.forEach((fromConfig, i) => {
    const toConfig: CityConfig | undefined = CityConfigList[i + 1];

    if (!toConfig) {
      return;
    }

    // 确定多个坐标作为曲线的V1
    const curveMidPointList: Vector3[] = [];

    // 确定点位
    Array(60)
      .fill(null)
      .forEach(() => {
        const newMidPoint = new Vector3(
          (Math.random() - 0.5) * 300,
          (Math.random() - 0.5) * 300 + 180,
          (Math.random() - 0.5) * 300
        );

        curveMidPointList.push(newMidPoint); // 由1/3位置附近随意点位作为V1
      });

    // 设置曲线
    fromConfig.pointVectorList.forEach((formVector, index) => {
      const toVector = toConfig.pointVectorList[index];

      const curve = new CatmullRomCurve3([formVector, curveMidPointList[index % curveMidPointList.length], toVector]);
      curve.getPoints(50);
      fromConfig.toNextCurves.push(curve);
    });
  });
};
