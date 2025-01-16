import FadeBox from '@/pages/home/components/FadeBox';
import './index.less';
import { Link } from '@@/exports';
const FirstSide = () => {
  return (
    <div className={'first-side'}>
      <FadeBox style={{ fontSize: '20px' }}>我是老孟 &nbsp;&nbsp;1993&nbsp;&nbsp;在成都</FadeBox>

      <br></br>

      <br></br>

      <FadeBox>#前端</FadeBox>
      <FadeBox>#奶爸</FadeBox>
      <FadeBox>#退役舞者</FadeBox>
      <FadeBox>#拳击票友</FadeBox>
      <FadeBox>#纹身师</FadeBox>
      <FadeBox>#盘核桃专家</FadeBox>
      <FadeBox>#强直性脊柱炎患者</FadeBox>
      <br></br>
      <br></br>
      <FadeBox>玩了8年前端，依然热爱。</FadeBox>
      <br></br>

      <FadeBox>一路辗转，从北到南，现定居成都。</FadeBox>
      <br></br>

      <FadeBox>
        <Link style={{ color: '#fff' }} to={'/timeline'} rel="noreferrer">
          (点击查看一路经历)
        </Link>
      </FadeBox>
    </div>
  );
};
export default FirstSide;
