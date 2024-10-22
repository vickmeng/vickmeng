import { switchModal } from '@/pages/canvas/switchModal';
import { useEffect, useState } from 'react';
import { ConfigList } from '@/pages/canvas/config';
import InitLoading from '@/components/InitLoading';

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [switching, setSwitching] = useState(false);

  const hasPre = currentIndex > 0;
  const hasNext = currentIndex < ConfigList.length - 1;

  useEffect(() => {
    import('./canvas/init');
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

              setCurrentIndex(toIndex);
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
              setCurrentIndex(toIndex);
            }}
          >
            下下下下下下
          </button>
        )}
      </div>
    </>
  );
}
