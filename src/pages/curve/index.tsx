import './canvas';
import { add1, add2, add3, add4, fly } from '@/pages/curve/canvas';

// add1();
// add2();
// add3();
// add4();
const Curve = () => {
  return (
    <div style={{ position: 'fixed', color: '#fff' }}>
      <h3>起点(0, 0, 0)，途径(50, 30, 0)，终点(100, 0, 0)</h3>
      <button onClick={add1}>加一个飞线</button>
      <br />
      <button onClick={add2}>加一个平滑点的</button>
      <br />
      <button onClick={add3}>加一个俯冲的飞线</button>
      <br />
      <button onClick={add4}>换个方式</button> <a href={'./bezierCurve'}>具体看原理</a>
      <br />
      <button onClick={fly}>动起来</button>
    </div>
  );
};
export default Curve;
