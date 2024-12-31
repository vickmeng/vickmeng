import { ReactNode } from 'react';
import './index.less';

interface CardProps {
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
}
// 没用了
const CardTitle = (props: { children: ReactNode }) => {
  return (
    <h3 className={'card__title'}>
      <div className={'card__title__content'}>{props.children}</div>

      <div className={'card__title__arrow'}></div>
    </h3>
  );
};

const ModelDescCard = (props: CardProps) => {
  const { title, children, onClose } = props;

  return (
    <div className={'card-mark'}>
      <div className={'card'}>
        <div className={'card__title-wrapper'}>
          <CardTitle>{title}</CardTitle>
          <div className={'card__close'} onClick={onClose}>
            ×
          </div>
        </div>
        <div className={'card__content'}>{children}</div>
      </div>
    </div>
  );
};
export default ModelDescCard;
