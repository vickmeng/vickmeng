import { CatmullRomCurve3, Vector3 } from 'three';
import { Config } from '@/pages/canvas/types';
import { daqingConfig } from '@/pages/canvas/daqing';
import { qingdaoConfig } from '@/pages/canvas/qingdao';
import { dalianConfig } from '@/pages/canvas/dalian';
import { chengduConfig } from '@/pages/canvas/chengdu';

//

export const ConfigList: Config[] = [daqingConfig, qingdaoConfig, dalianConfig, chengduConfig];

// handleCalculateConfigList通过计算补全配置
export const handleCalculateConfigList = () => {
  // 率先计算所有曲线
  ConfigList.forEach((fromConfig, i) => {
    const toConfig: Config | undefined = ConfigList[i + 1];

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
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000 + 480,
          (Math.random() - 0.5) * 1000
        );

        curveMidPointList.push(newMidPoint); // 由1/3位置附近随意点位作为V1
      });

    // 设置曲线
    fromConfig.pointVectorList.forEach((formVector, index) => {
      const toVector = toConfig.pointVectorList[index];

      const curve = new CatmullRomCurve3([formVector, curveMidPointList[index % curveMidPointList.length], toVector]);
      curve.getPoints(500);
      fromConfig.toNextCurves.push(curve);
    });
  });
};
