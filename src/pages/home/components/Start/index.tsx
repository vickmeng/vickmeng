import mousewheel from '@/assets/mousewheel.svg';
import './index.less';
import { useEffect } from 'react';
import { startTrackCamera } from '@/pages/home/canvas/startTrackCamera';

const Start = () => {
  useEffect(() => {
    const _play = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > 30) {
        startTrackCamera();
      }
    };

    document.addEventListener('wheel', _play);

    return () => {
      document.removeEventListener('wheel', _play);
    };
  }, []);

  return (
    <>
      <div className={'next-page-tip'} onClick={startTrackCamera}>
        <div>开始</div>
        <img src={mousewheel} width={60}></img>
      </div>
    </>
  );
};
export default Start;
