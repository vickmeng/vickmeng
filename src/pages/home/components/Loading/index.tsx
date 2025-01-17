import './index.less';
import { useSnapshot } from 'valtio/react';
import { loadingStore } from '@/pages/home/store';

const Loading = () => {
  const { loading } = useSnapshot(loadingStore);

  return (
    <div className={`home-loading ${loading ? '' : 'finish'}`}>
      <div className={'loader'}></div>
    </div>
  );
};
export default Loading;
