import { ReactNode } from 'react';
import './index.less';
import { useSwiper } from 'swiper/react';
import { useSnapshot } from 'valtio/react';
import { sideIndexStore } from '@/pages/home/store';
import FadeBox from '@/pages/home/components/FadeBox';

const NavLink = ({ children, slideToIndex }: { children: ReactNode; slideToIndex: number }) => {
  const swiper = useSwiper();

  const { sideIndex } = useSnapshot(sideIndexStore);

  return (
    <div
      className={`nav-link ${sideIndex === slideToIndex ? 'active' : ''}`}
      onClick={() => {
        swiper.slideTo(slideToIndex);
      }}
    >
      {children}

      {/*  下横杠 */}
      <div className={'nav-link-underline'}></div>
    </div>
  );
};

const Nav = () => {
  return (
    <div className={'nav-bar'}>
      <FadeBox>
        <NavLink slideToIndex={0}>前言</NavLink>
      </FadeBox>
      <FadeBox>
        <NavLink slideToIndex={1}>工作</NavLink>
      </FadeBox>
      <FadeBox>
        <NavLink slideToIndex={2}>项目</NavLink>
      </FadeBox>
      <FadeBox>
        <NavLink slideToIndex={3}>社区</NavLink>
      </FadeBox>
      <FadeBox>
        <NavLink slideToIndex={4}>我</NavLink>
      </FadeBox>
    </div>
  );
};
export default Nav;
