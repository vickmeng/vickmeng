import { switchModel } from '@/pages/home/canvas/switchModel';
import { useCallback, useEffect, useState } from 'react';

import InitLoading from './InitLoading';
import { useSnapshot } from 'valtio/react';
import { currentIndexStore } from '@/pages/home/store';
import { init } from '@/pages/home/canvas/init';
import { CityConfigList } from '@/pages/home/canvas/cityConfig';
import Indicator from '@/pages/home/Indicator';
import './index.less';

export default function HomePage() {
  const { currentIndex } = useSnapshot(currentIndexStore);

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

  return (
    <div id={'timeline-page'}>
      <InitLoading />
      {!switching && <Indicator toNext={toNext} toPre={toPre} />}
    </div>
  );
}
