import mousewheel from '@/assets/mousewheel.svg';
import './index.less';
const ContentFirst = () => {
  return (
    <>
      <div className={'next-page-tip'}>
        <div>翻页</div>
        <img src={mousewheel} width={60}></img>
      </div>
    </>
  );
};
export default ContentFirst;
