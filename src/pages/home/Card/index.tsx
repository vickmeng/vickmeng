import { ReactNode } from 'react';
import './index.less';

interface CardProps {
  title: ReactNode;
  children: ReactNode;
  side: 'left' | 'right';
}

const CardTitle = (props: { children: ReactNode }) => {
  return (
    <h3 className={'card__title'}>
      <div className={'card__title__content'}>{props.children}</div>

      <div className={'card__title__arrow'}></div>
    </h3>
  );
};

const Card = (props: CardProps) => {
  const { title, children, side } = props;

  return (
    <div className={`card ${side}`}>
      <CardTitle>{title}</CardTitle>
      <div className={'card__content'}>{children}</div>
    </div>
  );
};
export default Card;
