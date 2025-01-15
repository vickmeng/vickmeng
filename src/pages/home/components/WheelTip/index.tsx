import mousewheel from '@/assets/mousewheel.svg';
import './index.less';

const WheelTip = () => {
  return (
    <>
      <div className={'next-page-tip'}>
        <div>滚动翻页</div>
        <img src={mousewheel} width={60}></img>
      </div>
    </>
  );
};
export default WheelTip;
