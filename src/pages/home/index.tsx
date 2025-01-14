import { useEffect } from 'react';
import 'swiper/css/mousewheel';
import 'swiper/css';
import './index.less';
import Start from '@/pages/home/components/Start';
import { useSnapshot } from 'valtio/react';
import { playingStore } from '@/pages/home/store';

const Home = () => {
  const { playing } = useSnapshot(playingStore);

  useEffect(() => {
    // @ts-ignore
    import('./canvas/init.ts');
  }, []);

  return (
    <>
      <div id={'home_bg'} style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: '-1' }}></div>

      {!playing && <Start />}
    </>
  );
};
export default Home;
