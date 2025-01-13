import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import 'swiper/css/mousewheel';
import 'swiper/css';
import './index.less';
import Nav from '@/pages/home/components/Nav';
import { startTrackCamera } from '@/pages/home/canvas/startTrackCamera';

const Home = () => {
  useEffect(() => {
    // @ts-ignore
    import('./canvas/init.ts');
  }, []);

  return (
    <>
      <div id={'home_bg'} style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: '-1' }}></div>

      <Swiper
        autoplay={false}
        direction={'vertical'}
        mousewheel={{
          thresholdDelta: 60,
        }}
        modules={[Mousewheel]}
        speed={500}
        draggable={false}
        onBeforeSlideChangeStart={(swiper) => {
          startTrackCamera();
        }}
      >
        <Nav></Nav>

        <SwiperSlide>
          <h1 style={{ color: 'red' }}> Slide 1</h1>
        </SwiperSlide>
        <SwiperSlide>
          <h1 style={{ color: 'red' }}> Slide 2</h1>
        </SwiperSlide>
        <SwiperSlide>
          <h1 style={{ color: 'red' }}> Slide 3</h1>
        </SwiperSlide>
        <SwiperSlide>
          <h1 style={{ color: 'red' }}> Slide 4</h1>
        </SwiperSlide>
        <SwiperSlide>
          <h1 style={{ color: 'red' }}> Slide 5</h1>
        </SwiperSlide>
        <SwiperSlide>
          <h1 style={{ color: 'red' }}> Slide 6</h1>
        </SwiperSlide>
      </Swiper>
    </>
  );
};
export default Home;
