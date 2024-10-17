import { switchModal } from '@/pages/canvas/switchModal';
import { useState } from 'react';
import { ConfigList } from '@/pages/canvas/config';

import('./canvas/init');
export default function HomePage() {
  // useEffect(() => {}, []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [switching, setSwitching] = useState(false);

  const hasPre = currentIndex > 0;
  const hasNext = currentIndex < ConfigList.length - 1;

  return (
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
  );
}
