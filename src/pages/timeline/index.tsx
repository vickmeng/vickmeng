import { switchModel } from '@/pages/timeline/canvas/switchModel';
import { useCallback, useEffect, useMemo, useState } from 'react';

import InitLoading from './InitLoading';
import { useSnapshot } from 'valtio/react';
import { currentIndexStore, modelOpenStore } from '@/pages/timeline/store';
import { init } from '@/pages/timeline/canvas/init';
import { CityConfigList } from '@/pages/timeline/canvas/cityConfig';
import Indicator from '@/pages/timeline/Indicator';
import './index.less';
import ModelDescCard from '@/pages/timeline/ModelDescCard';

export default function TimelinePage() {
  const { currentIndex } = useSnapshot(currentIndexStore);
  const { open } = useSnapshot(modelOpenStore);

  const [switching, setSwitching] = useState(false);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--theme-primary-color', CityConfigList[currentIndex].UIThemeColor);
  }, [currentIndex]);

  const toNext = useCallback(async () => {
    const hasNext = currentIndex < CityConfigList.length - 1;

    if (!hasNext) {
      return;
    }

    const toIndex = currentIndex + 1;
    setSwitching(true);
    await switchModel({ fromIndex: currentIndex, toIndex });
    setSwitching(false);
    currentIndexStore.currentIndex = toIndex;
  }, [currentIndex]);

  const toPre = useCallback(async () => {
    const hasPre = currentIndex > 0;

    if (!hasPre) {
      return;
    }

    const toIndex = currentIndex - 1;
    setSwitching(true);
    await switchModel({ fromIndex: currentIndex, toIndex });
    setSwitching(false);
    currentIndexStore.currentIndex = toIndex;
  }, [currentIndex]);

  useEffect(() => {
    const cb = async (e: KeyboardEvent) => {
      if (switching) {
        return;
      }
      if (e.key === 'd') {
        toNext();
      } else if (e.key === 'a') {
        toPre();
      } else if (e.key === 'Escape') {
        // 退出;
      }
    };

    document.body.addEventListener('keydown', cb);

    return () => {
      document.body.removeEventListener('keydown', cb);
    };
  }, [switching, toNext, toPre]);

  const currentConfig = useMemo(() => {
    return CityConfigList[currentIndex];
  }, [currentIndex]);

  return (
    <div id={'timeline-page'}>
      <InitLoading />

      {open && (
        <ModelDescCard
          title={currentConfig.name_cn}
          onClose={() => {
            modelOpenStore.open = false;
          }}
        >
          {currentConfig.modelDesc}
        </ModelDescCard>
      )}

      {!switching && <Indicator toNext={toNext} toPre={toPre} />}
    </div>
  );
}
