import { switchModal } from '@/pages/home/canvas/switchModal';
import { useEffect, useMemo, useState } from 'react';

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

  const hasPre = currentIndex > 0;
  const hasNext = currentIndex < CityConfigList.length - 1;

  useEffect(() => {
    init();
  }, []);

  const desc = useMemo(() => {
    return CityConfigList[currentIndex].desc;
  }, [currentIndex]);

  useEffect(() => {
    const root = document.documentElement;

    root.style.setProperty('--theme-primary-color', CityConfigList[currentIndex].UIThemeColor);
  }, [currentIndex]);

  useEffect(() => {
    const cb = async (e: KeyboardEvent) => {
      if (switching) {
        return;
      }

      if (e.key === 'd') {
        // 前进
        if (!hasNext) {
          return;
        }

        const toIndex = currentIndex + 1;
        setSwitching(true);
        await switchModal({ fromIndex: currentIndex, toIndex });
        setSwitching(false);
        currentIndexStore.currentIndex = toIndex;
      } else if (e.key === 'a') {
        // 后退
        if (!hasPre) {
          return;
        }

        const toIndex = currentIndex - 1;
        setSwitching(true);
        await switchModal({ fromIndex: currentIndex, toIndex });
        setSwitching(false);
        currentIndexStore.currentIndex = toIndex;
      } else if (e.key === 'Escape') {
        // 退出;
      }
    };

    document.body.addEventListener('keydown', cb);

    return () => {
      document.body.removeEventListener('keydown', cb);
    };
  }, [switching, setSwitching, currentIndex, hasNext, hasPre]);

  return (
    <div id={'timeline-page'}>
      <InitLoading />
      {!switching && <Indicator />}

      {!switching && <>{desc}</>}
    </div>
  );
}
