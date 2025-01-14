import { ReactNode } from 'react';
import './index.less';

const NavLink = ({ children, slideToIndex }: { children: ReactNode; slideToIndex: number }) => {
  return (
    <div
      className={'nav-link active'}
      onClick={() => {
        // swiper.slideTo(slideToIndex);
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
      <NavLink slideToIndex={1}>我</NavLink>
      <NavLink slideToIndex={2}>工作</NavLink>
      <NavLink slideToIndex={3}>项目</NavLink>
      <NavLink slideToIndex={4}>社区</NavLink>
      <NavLink slideToIndex={5}>本站</NavLink>
    </div>
  );
};
export default Nav;
