import { ReactNode } from 'react';
import './index.less';
interface ButtonProps {
  children: ReactNode;
}

const Button = (props: ButtonProps) => {
  const { children } = props;

  return <div className={'ui-button'}>{children}</div>;
};
export default Button;
