import './index.less';
import { useSnapshot } from 'valtio/react';
import { currentIndexStore } from '@/pages/timeline/store';
import { CityConfigList } from '@/pages/timeline/canvas/cityConfig';

const Indicator = (props: { toPre: () => Promise<void>; toNext: () => Promise<void> }) => {
  const { currentIndex } = useSnapshot(currentIndexStore);

  const hasPre = currentIndex > 0;
  const hasNext = currentIndex < CityConfigList.length - 1;

  return (
    <div className={'indicator'}>
      {hasPre && (
        <button
          className={'indicator-item'}
          onClick={() => {
            props.toPre();
          }}
        >
          <span className={'indicator-item__icon'}>a</span>
          <span className={'indicator-item__content'}>上一页</span>
        </button>
      )}

      {hasNext && (
        <button
          className={'indicator-item'}
          onClick={() => {
            props.toNext();
          }}
        >
          <span className={'indicator-item__icon'}>b</span>
          <span className={'indicator-item__content'}>下一页</span>
        </button>
      )}

      <button className={'indicator-item'}>
        <span className={'indicator-item__icon'}>esc</span>
        <span className={'indicator-item__content'}>退出</span>
      </button>
    </div>
  );
};
export default Indicator;
