import './index.less';
import FadeBox from '@/pages/home/components/FadeBox';

const ProjectSide = () => {
  return (
    <div className={'project-side'}>
      <div style={{ width: '900px', marginBottom: '40px' }}>
        <FadeBox>
          <h2 style={{ marginTop: '42px', marginBottom: '24px' }}>项目经历</h2>
        </FadeBox>
        <div className={'projects-wrapper'}>
          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>云筑物流/收验货系统</h3>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>我的角色</div>
                <div className={'desc-text'}>前端负责人</div>
              </div>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>项目介绍 </div>
                <div className={'desc-text'}>
                  <p>
                    围绕工地采购场景的整套系统，共10余个应用。打通招投标，竞标，下单，物流跟踪，现场收/验/领完整链路。
                  </p>
                  <p>业务上以策略 + 适配模式兼容货拉拉，满帮等多家物流商的多态化流程。</p>
                  <p>用React-native + React-native-web实现移动端跨端能力，编写一套代码运行于多个平台。</p>
                  <p>基于qiankun的实现微前端架构，被多个系统集成。</p>
                  <p>用three.js进行现场收货3D可视化展示。</p>
                </div>
              </div>
            </FadeBox>

            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>重点技术</div>
                <div className={'desc-text'}>
                  Typescript，React，React-native，React-native-web，高德地图，Taro，rx-form，Umi，基于pnpm的monorepo，three，antd，qiankun，lerna
                </div>
              </div>
            </FadeBox>
          </div>

          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>FormBuilder无代码表单配置平台</h3>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>我的角色 </div>
                <div className={'desc-text'}>前端主程</div>
              </div>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>项目介绍</div>
                <div className={'desc-text'}>
                  <p>为新加坡政府打造的无代码表单生成平台，通过简单操作发布表单</p>
                  <p>
                    分设计端（Angular）和填写端（React）与自研基础组件库（React），并提供了完整的单元测试。开发者分别来自中国、新加坡、印度等多国。
                  </p>
                  <p>
                    过程中深感React在表单场景的乏力，于是着手开源项目
                    <a style={{ color: 'white' }} href={'https://vickmeng.github.io/rx-form/'}>
                      rx-form
                    </a>
                    。
                  </p>
                </div>
              </div>
            </FadeBox>

            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>重点技术</div>
                <div className={'desc-text'}>
                  Typescript，Angular，React，Formik，testing-library，Jest，Lerna，Karma
                </div>
              </div>
            </FadeBox>
          </div>

          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>天狗网农产品商城</h3>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>我的角色</div>
                <div className={'desc-text'}>前端开发</div>
              </div>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>项目介绍</div>
                <div className={'desc-text'}>基于Ionic的移动端混合开发项目</div>
              </div>
            </FadeBox>

            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>重点技术</div>
                <div className={'desc-text'}>Typescript，Angular，Cordova，Ionic</div>
              </div>
            </FadeBox>
          </div>

          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>天狗网BI分析系统</h3>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>我的角色</div>
                <div className={'desc-text'}>前端开发</div>
              </div>
            </FadeBox>
            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>项目介绍</div>
                <div className={'desc-text'}>
                  <p>基于Ts + Angular的可视化数据分析平台，同时也是最早的一批尝鲜Angular的项目。</p>
                  <p>由G2完成基础可视化展示，部分特别需求由G2完成。</p>
                </div>
              </div>
            </FadeBox>

            <FadeBox>
              <div className={'desc-wrapper'}>
                <div className={'desc-title'}>重点技术</div>
                <div className={'desc-text'}>Typescript，Angular，D3.js，G2</div>
              </div>
            </FadeBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSide;
