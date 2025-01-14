import mousewheel from '@/assets/mousewheel.svg';
import './index.less';
import { startTrackCamera } from '@/pages/home/canvas/startTrackCamera';

const Start = () => {
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
