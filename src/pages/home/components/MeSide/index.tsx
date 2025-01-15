import './index.less';
import photo from '@/assets/photo.jpg';
import FadeBox from '@/pages/home/components/FadeBox';
import darkevil from '@/assets/darkevil.png';

const MeSide = () => {
  return (
    <div className={'me-side'}>
      <div className={'me-side__content'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ marginRight: '20px' }}>
            <FadeBox>
              <img src={photo} className={'photo'}></img>
            </FadeBox>
          </div>
          <div>
            <FadeBox>
              <p>电话/微信：15680056817</p>
            </FadeBox>
            <FadeBox>
              <p>
                知乎：
                <a href={'https://www.zhihu.com/column/c_1055478992487972864'}>
                  https://www.zhihu.com/column/c_1055478992487972864
                </a>
              </p>
            </FadeBox>
            <FadeBox>
              <p>
                git：
                <a href={'https://github.com/vickmeng'}>https://github.com/vickmeng </a>
              </p>
            </FadeBox>
          </div>
        </div>

        <FadeBox>
          <p>如果你喜欢这个网站，或是想共同学习进步，或是有好的工作机会，请多多联系我！直接加我微信就OK！</p>
        </FadeBox>

        <br></br>

        <FadeBox>
          <p>至于为什么做了这个网站？</p>
        </FadeBox>
        <FadeBox>
          <p>因为最近真的很迷藤本树，这网站也是还原了暗之恶魔登场的名场面。</p>
        </FadeBox>

        <FadeBox>
          <img src={darkevil} style={{ width: '200px' }}></img>
        </FadeBox>
        <FadeBox>
          <h2>藤本树！我的超人！</h2>
        </FadeBox>
      </div>
    </div>
  );
};

export default MeSide;
