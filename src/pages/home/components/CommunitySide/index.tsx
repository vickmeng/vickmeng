import './index.less';
import FadeBox from '@/pages/home/components/FadeBox';

const CommunitySide = () => {
  return (
    <div className={'community-side'}>
      <div style={{ width: '900px' }}>
        <h2 style={{ marginBottom: '40px' }}>社区贡献</h2>
        <div className={'community-wrapper'}>
          <div className={'community-item'}>
            <FadeBox>
              <h3 className={'title'}>rxform</h3>
            </FadeBox>
            <FadeBox>
              <p>
                基于rxjs的表单状态引擎，灵活、高性能、跨端、跨框架，提供完整文档与99%单元测试覆盖，解决react在表单场景的乏力。目前在公司内作为内部工具应用于多个项目。
              </p>
            </FadeBox>
          </div>

          <div className={'community-item'}>
            <FadeBox>
              <h3 className={'title'}>3D纹身模拟器</h3>
            </FadeBox>
            <FadeBox>
              <p>基于threejs的纹身模拟工具。</p>
            </FadeBox>
          </div>

          <div className={'community-item'}>
            <FadeBox>
              <h3 className={'title'}>three-track-camera</h3>
            </FadeBox>
            <FadeBox>
              <p>基于three.js的轨道相机，具备镜头追踪，轨迹推进等功能，本站背景就是demo。</p>
            </FadeBox>
          </div>

          <div className={'community-item'}>
            <FadeBox>
              <h3 className={'title'}>RxJS中文官网</h3>
            </FadeBox>
            <FadeBox>
              <p>2016年，作为首批Angular的使用者，加入了RxJS中文社区，参与官网与高分文章翻译工作。</p>
            </FadeBox>

            <FadeBox>
              <p>
                <a href={'https://cn.rx.js.org/'} target={'_blank'} rel="noreferrer">
                  中文官网 https://cn.rx.js.org/
                </a>
              </p>
            </FadeBox>
            <FadeBox>
              <p>
                <a href={'https://rxjs-cn.github.io/learn-rxjs-operators/'} target={'_blank'} rel="noreferrer">
                  学习Rxjs操作符 https://rxjs-cn.github.io/learn-rxjs-operators/
                </a>
              </p>
            </FadeBox>
            <FadeBox>
              <p>
                <a href={'https://github.com/RxJS-CN'} target={'_blank'} rel="noreferrer">
                  RxJS中文社区 https://github.com/RxJS-CN
                </a>
              </p>
            </FadeBox>
          </div>

          <div className={'community-item'}>
            <FadeBox>
              <h3 className={'title'}>拳击秒表（敬请期待）</h3>
            </FadeBox>
            <FadeBox>
              <p>好用的拳击训练辅助小程序，包含比赛计时，训练时间规划，反应训练等功能。</p>
            </FadeBox>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CommunitySide;
