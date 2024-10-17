import { switchToOther } from '@/pages/canvas/switchToOther';
import { useRef, useState } from 'react';

import('./canvas/init');
export default function HomePage() {
  // useEffect(() => {}, []);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0 }}>
      <button
        onClick={async () => {
          const toIndex = currentIndex - 1;

          await switchToOther({ fromIndex: currentIndex, toIndex });

          setCurrentIndex(toIndex);
        }}
      >
        上上上上上上
      </button>
      <button
        onClick={async () => {
          const toIndex = currentIndex + 1;

          await switchToOther({ fromIndex: currentIndex, toIndex });

          setCurrentIndex(toIndex);
        }}
      >
        下下下下下下
      </button>
    </div>
  );
}
