import { useEffect } from 'react';

const Home = () => {
  useEffect(() => {
    import('./canvas/init.ts');
  }, []);

  return (
    <>
      <div id={'home_bg'} style={{ position: 'fixed', top: 0, bottom: 0, left: 0, right: 0, zIndex: '-1' }}></div>
      123
    </>
  );
};
export default Home;
