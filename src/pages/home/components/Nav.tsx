import { useSwiper } from 'swiper/react';

const Nav = () => {
  const swiper = useSwiper();

  return (
    <div style={{ position: 'fixed', zIndex: 1000, top: 0 }}>
      <button
        onClick={() => {
          swiper.slideTo(0);
        }}
      >
        首页
      </button>
      <button
        onClick={() => {
          swiper.slideTo(1);
        }}
      >
        我
      </button>
      <button
        onClick={() => {
          swiper.slideTo(2);
        }}
      >
        工作经历
      </button>
      <button
        onClick={() => {
          swiper.slideTo(3);
        }}
      >
        参与项目
      </button>
      <button
        onClick={() => {
          swiper.slideTo(4);
        }}
      >
        社区贡献
      </button>
      <button
        onClick={() => {
          swiper.slideTo(5);
        }}
      >
        关于本站
      </button>
    </div>
  );
};
export default Nav;
