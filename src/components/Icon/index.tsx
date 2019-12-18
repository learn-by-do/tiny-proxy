import React, { StyleHTMLAttributes } from 'react';
import Plus from './Plus';
import Minus from './Minus';
import Trash from './Trash';
import Save from './Save';
import './index.scss';
import { SvgAttributes } from 'csstype';

function getTypedIcon(type: string) {
  let Icon = Plus;
  switch (type) {
    case 'minus':
      Icon = Minus;
      break;
    case 'plus':
      Icon = Plus;
      break;
    case 'trash':
      Icon = Trash;
      break;
    case 'save':
      Icon = Save;
      break;
  }
  return Icon;
}
interface IconProps extends CommonIconProps {
  type: string;
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  title?: string;
  size?: string;
  color?: string;
}

export interface CommonIconProps {
  size?: string;
  color?: string;
  extraStyles?: StyleHTMLAttributes<SvgAttributes>;
}

const Icon = ({ type, onClick, title = '', ...rest }: IconProps) => {
  const Type = getTypedIcon(type);

  const handleClick: React.MouseEventHandler<HTMLSpanElement> = event => {
    onClick && onClick(event);
  };

  return (
    <span className="IconButton" onClick={handleClick} title={title}>
      <Type {...rest} />
    </span>
  );
};

export default Icon;
