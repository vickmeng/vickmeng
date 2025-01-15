import './index.less';
import FadeBox from '@/pages/home/components/FadeBox';

const WorkSide = () => {
  return (
    <div className={'work-side'}>
      <div style={{ width: '200px', paddingBottom: '198px' }}>
        <FadeBox>
          <h2 style={{ marginBottom: '60px' }}>工作经历</h2>
        </FadeBox>

        <FadeBox>进过外企、央企、创业小团队</FadeBox>
        <br></br>
        <br></br>

        <FadeBox>当过跟班，做过主程，带过团队</FadeBox>
        <br></br>
        <br></br>

        <FadeBox>加盟过高度敏捷开发团队</FadeBox>
        <br></br>
        <br></br>

        <FadeBox>和外国开发者组过队</FadeBox>
        <br></br>
        <br></br>

        <FadeBox>参加过上百次code review</FadeBox>
        <br></br>
        <br></br>

        <FadeBox>做过培训讲师</FadeBox>
      </div>

      <FadeBox>
        <div className={'divider-line'}></div>
      </FadeBox>

      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '20px' }}>
          <p className={'title'}>
            <FadeBox>中建电子商务有限责任公司</FadeBox>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <FadeBox>2021至今</FadeBox>
          </p>

          <FadeBox>
            <p>任物流创新团队前端负责人，从0组队，主导10余个项目。</p>
          </FadeBox>
          <FadeBox>
            <p>团队由本部员工，外包员工，临时劳务多角色组成，最高达12人。</p>
          </FadeBox>
          <FadeBox>
            <p>负责内部协调，规范制定，内训，代码审核，重难点攻坚，招评标等工作。</p>
          </FadeBox>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <p className={'title'}>
            <FadeBox>Thoughtworks</FadeBox>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <FadeBox>2019-2021</FadeBox>
          </p>

          <FadeBox>
            <p>加入海外业务线，任前端主程（高端外包线，4800/人天）。</p>
          </FadeBox>
          <FadeBox>
            <p>兼任TDD，Angular讲师。</p>
          </FadeBox>
          <FadeBox>
            <p>与来自新加坡、印度、马来西亚等不同国家开发者共同工作，一起经历了近百次code review。</p>
          </FadeBox>
          <FadeBox>
            <p>
              Thoughtworks是一家崇尚敏捷开发、充满分享风气的公司。在这里领略了最完整的敏捷开发，经历了TDD，Pair，Showcase，Retro等一系列有趣的工程实践。
            </p>
          </FadeBox>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <p className={'title'}>
            <FadeBox>大连商务集团天狗网</FadeBox>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <FadeBox>2016-2019</FadeBox>
          </p>

          <FadeBox>
            <p>职业生涯的起点，负责日常迭代。</p>
            <p>
              落地从es5+Jq到ts+Angular的技术升级。作为是国内最早的一批Angular使用者，借机加入RxJS中文社区，结识了很多同好。
            </p>
          </FadeBox>
        </div>
      </div>
    </div>
  );
};
export default WorkSide;
