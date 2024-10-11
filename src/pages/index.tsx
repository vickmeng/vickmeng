import { useEffect } from 'react';
import { switchToOther } from '@/pages/canvas/switchToOther';

export default function HomePage() {
  useEffect(() => {
    import('./canvas/core');
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0 }}>
      <button>上上上上上上</button>
      <button
        onClick={() => {
          switchToOther({ currentId: '1', targetId: '2' });
        }}
      >
        下下下下下下
      </button>
    </div>
  );
}
