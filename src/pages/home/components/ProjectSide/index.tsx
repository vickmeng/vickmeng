import './index.less';
import FadeBox from '@/pages/home/components/FadeBox';

const ProjectSide = () => {
  return (
    <div className={'project-side'}>
      <div style={{ width: '900px' }}>
        <FadeBox>
          <h2 style={{ marginBottom: '40px' }}>项目经历</h2>
        </FadeBox>
        <div className={'projects-wrapper'}>
          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>云筑物流/收验货系统</h3>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>我的角色 </span>
                前端负责人
              </p>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>项目介绍 </span>
                针对工地采购场景，共10余个应用。打通招投标，竞标，下单，物流跟踪，现场“收验领”完整链路，。
                以策略模式适配货拉拉，满帮等多家物流商的多态化业务。
                用跨端方案实现一套代码运行于分手机web，小程序，原生多个平台。 用微前端架构提供容器化集成能力。
                用three.js进行现场收货3D可视化展示。
              </p>
            </FadeBox>

            <FadeBox>
              <p>
                <span className={'sub-title'}>重点技术 </span>
                Typescript，React，React-native，React-native-web，高德地图，Taro，rx-form，Umi，基于pnpm的monorepo，three，antd，qiankun，lerna
              </p>
            </FadeBox>
          </div>
          {/* <FadeBox> */}
          {/*  <div className={'divider-line'}></div> */}
          {/* </FadeBox> */}

          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>FormBuilder无代码表单配置平台</h3>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>我的角色 </span>
                前端主程
              </p>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>项目介绍 </span>
                为新加坡政府打造的无代码表单生成平台，通过简单操作发布表单，类似于金数据。分设计端（Angular）和填写端（React）与自研基础组件库（React）。开发者分别来自中国、新加坡、印度等多国。
                过程中深感React在表单场景的乏力，于是着手开源项目
                <a style={{ color: 'white' }} href={''}>
                  rx-form
                </a>
                。
              </p>
            </FadeBox>

            <FadeBox>
              <p>
                <span className={'sub-title'}>重点技术 </span>
                Typescript，Angular，React，Formik，testing-library，Lerna
              </p>
            </FadeBox>
          </div>

          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>天狗网农产品商城</h3>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>我的角色 </span>
                前端开发
              </p>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>项目介绍 </span>
                项目介绍：基于Ionic的移动端混合开发项目。
              </p>
            </FadeBox>

            <FadeBox>
              <p>
                <span className={'sub-title'}>重点技术 </span>
                Typescript，Angular，Cordova，Ionic
              </p>
            </FadeBox>
          </div>

          <div className={'project-item'}>
            <FadeBox>
              <h3 className={'title'}>天狗网BI分析系统</h3>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>我的角色 </span>
                前端开发
              </p>
            </FadeBox>
            <FadeBox>
              <p>
                <span className={'sub-title'}>项目介绍 </span>
                项目介绍：负责调研与落地从Jq + es5到Angular + Typescript技术升级，负责可视化相关功能的调研与开发。
              </p>
            </FadeBox>

            <FadeBox>
              <p>
                <span className={'sub-title'}>重点技术 </span>
                Typescript，Angular，D3.js，G2，Jquery
              </p>
            </FadeBox>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectSide;
