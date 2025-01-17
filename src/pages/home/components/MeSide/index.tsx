import './index.less';
import photo from '@/assets/photo.jpg';
import FadeBox from '@/pages/home/components/FadeBox';
import darkevil from '@/assets/darkevil.png';

const MeSide = () => {
  return (
    <div className={'me-side'}>
      <div className={'me-side__content'}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
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
          <p>
            我是老孟，如果你喜欢这个网站，或是相约练拳击，或是想共同学习编程，或是有好的工作机会，请多多联系我！直接加我微信就OK！我在成都高新区！
          </p>
        </FadeBox>

        <br></br>

        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ flexBasis: '220px', paddingRight: '24px' }}>
            <FadeBox>
              <p>至于为什么做了这个网站？</p>
            </FadeBox>
            <FadeBox>
              <p>最近真的很迷藤本树，这里复刻了《链锯人》中暗之恶魔登场的名场面。</p>
            </FadeBox>
            <br></br>

            <FadeBox>
              <h2>藤本树！我的超人！!</h2>
            </FadeBox>
          </div>

          {/* <FadeBox> */}
          <img src={darkevil} style={{ width: '200px' }}></img>
          {/* </FadeBox> */}
        </div>
      </div>
    </div>
  );
};

export default MeSide;
