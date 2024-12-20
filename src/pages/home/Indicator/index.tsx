import './index.less';

const Indicator = () => {
  return (
    <div className={'indicator'}>
      <div className={'indicator-item'}>
        <div className={'indicator-item__icon'}>a</div>
        上一页
      </div>

      <div className={'indicator-item'}>
        <div className={'indicator-item__icon'}>b</div>
        下一页
      </div>

      <div className={'indicator-item'}>
        <div className={'indicator-item__icon'}>esc</div>
        退出
      </div>
    </div>
  );
};
export default Indicator;
