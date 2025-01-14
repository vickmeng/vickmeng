import { useEffect } from 'react';
import './index.less';
import Start from '@/pages/home/components/Start';
import { useSnapshot } from 'valtio/react';
import { playingStore } from '@/pages/home/store';
import { startTrackCamera } from '@/pages/home/canvas/startTrackCamera';
import { trackHelperGroup } from '@/pages/home/canvas/core';

const Home = () => {
  const { playing } = useSnapshot(playingStore);

  useEffect(() => {
    // @ts-ignore
    import('./canvas/init.ts');
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        startTrackCamera();
      }
    };

    document.addEventListener('wheel', onWheel);

    return () => {
      document.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <>
      <div id={'home_bg'}></div>

      {!playing && <Start />}

      {playing && (
        <div
          style={{ position: 'fixed', color: '#fff', fontSize: '12px', cursor: 'pointer', zIndex: 1000, top: 0 }}
          onClick={() => {
            trackHelperGroup.visible = !trackHelperGroup.visible;
          }}
        >
          切换辅助工具
        </div>
      )}
    </>
  );
};
export default Home;
