import { CatmullRomCurve3, Vector3 } from 'three';
import { CityConfig } from '@/pages/timeline/canvas/types';
import { daqingConfig } from '@/pages/timeline/canvas/daqing';
import { qingdaoConfig } from '@/pages/timeline/canvas/qingdao';
import { dalianConfig } from '@/pages/timeline/canvas/dalian';
import { chengduConfig } from '@/pages/timeline/canvas/chengdu';

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

    // 设置曲线
    fromConfig.pointVectorList.forEach((formVector, index) => {
      const toVector = toConfig.pointVectorList[index];

      const curve = new CatmullRomCurve3([
        formVector,
        new Vector3((Math.random() - 0.5) * 300, (Math.random() - 0.5) * 300 + 180, (Math.random() - 0.5) * 300),
        toVector,
      ]);
      curve.getPoints(50);
      fromConfig.toNextCurves.push(curve);
    });
  });
};
