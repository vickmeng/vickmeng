import './index.less';
import { CSSProperties, ReactNode, useEffect, useRef } from 'react';

const Delay = [0, 300, 600, 900, 1200];

const FadeBox = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
  const boxRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const delay = Delay[Math.floor(Math.random() * Delay.length)];
    const timer = setTimeout(() => {
      boxRef.current!.classList.add('in');
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <span className={'fade-box'} ref={boxRef} style={style}>
      {children}
    </span>
  );
};
export default FadeBox;
