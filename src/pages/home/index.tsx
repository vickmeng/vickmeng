import { switchModal } from '@/pages/home/canvas/switchModal';
import { useEffect, useState } from 'react';
import { ConfigList } from '@/pages/home/canvas/config';
import InitLoading from '@/components/InitLoading';
import { useSnapshot } from 'valtio/react';
import { currentIndexStore } from '@/pages/home/store';

export default function HomePage() {
  const { currentIndex } = useSnapshot(currentIndexStore);

  // const [currentIndex, setCurrentIndex] = useState(0);
  const [switching, setSwitching] = useState(false);

  const hasPre = currentIndex > 0;
  const hasNext = currentIndex < ConfigList.length - 1;

  useEffect(() => {
    import('@/pages/home/canvas/init');
  }, []);

  return (
    <>
      <InitLoading />
      <div style={{ position: 'fixed', top: 0, left: 0 }}>
        {hasPre && (
          <button
            disabled={switching}
            onClick={async () => {
              const toIndex = currentIndex - 1;

              setSwitching(true);
              await switchModal({ fromIndex: currentIndex, toIndex });
              setSwitching(false);
              currentIndexStore.currentIndex = toIndex;
            }}
          >
            上上上上上上
          </button>
        )}
        {hasNext && (
          <button
            disabled={switching}
            onClick={async () => {
              const toIndex = currentIndex + 1;
              setSwitching(true);
              await switchModal({ fromIndex: currentIndex, toIndex });
              setSwitching(false);
              currentIndexStore.currentIndex = toIndex;
            }}
          >
            下下下下下下
          </button>
        )}
      </div>
    </>
  );
}
