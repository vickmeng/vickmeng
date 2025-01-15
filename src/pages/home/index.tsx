import { useEffect } from 'react';
import './index.less';
import WheelTip from '@/pages/home/components/WheelTip';
import { useSnapshot } from 'valtio/react';
import { playingStore, sideIndexStore } from '@/pages/home/store';
import { startTrackCamera } from '@/pages/home/canvas/startTrackCamera';
import Nav from '@/pages/home/components/Nav/Nav';
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import WorkSide from '@/pages/home/components/WorkSide';
import FirstSide from '@/pages/home/components/FirstSide';
import { Mousewheel } from 'swiper/modules';
import ProjectSide from '@/pages/home/components/ProjectSide';
import CommunitySide from '@/pages/home/components/CommunitySide';
import MeSide from '@/pages/home/components/MeSide';

const Home = () => {
  const { playing } = useSnapshot(playingStore);
  const { sideIndex } = useSnapshot(sideIndexStore);

  useEffect(() => {
    // @ts-ignore
    import('./canvas/init.ts');
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (playing) {
        return;
      }

      if (Math.abs(e.deltaY) > 30) {
        startTrackCamera();
      }
    };

    document.addEventListener('wheel', onWheel);

    return () => {
      document.removeEventListener('wheel', onWheel);
    };
  }, [playing]);

  return (
    <>
      <div id={'home_bg'}></div>

      {sideIndex !== 4 && <WheelTip />}

      {playing && (
        <>
          <Swiper
            direction={'vertical'}
            draggable={false}
            onSlideChange={(swiper) => {
              sideIndexStore.sideIndex = swiper.activeIndex;
            }}
            mousewheel={{
              thresholdDelta: 60,
            }}
            modules={[Mousewheel]}
            className={`${[1, 2, 3].includes(sideIndex) ? 'blur' : ''}`}
            speed={400}
            // slidesPerView={0}
            // lazyPreloadPrevNext={}
          >
            <Nav></Nav>
            <SwiperSlide>{({ isActive }) => (isActive ? <FirstSide /> : undefined)}</SwiperSlide>
            <SwiperSlide>{({ isActive }) => (isActive ? <WorkSide /> : undefined)}</SwiperSlide>
            <SwiperSlide>{({ isActive }) => (isActive ? <ProjectSide /> : undefined)}</SwiperSlide>
            <SwiperSlide>{({ isActive }) => (isActive ? <CommunitySide /> : undefined)}</SwiperSlide>
            <SwiperSlide>{({ isActive }) => (isActive ? <MeSide /> : undefined)}</SwiperSlide>
          </Swiper>
        </>
      )}
    </>
  );
};
export default Home;
