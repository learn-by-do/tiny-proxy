import React from 'react';
import Input from '../Input';
import Icon from '../Icon';
import './index.scss';

type ItemProps = {
  src: string;
  dist: string;
  onAdd: React.MouseEventHandler;
  onRemove: React.MouseEventHandler;
  onChange: (key: string, val: string) => void;
};
const Item = ({ src, dist, onAdd, onRemove, onChange }: ItemProps) => {
  const handleChange = (key: string) => {
    return (val: string) => {
      onChange(key, val);
    };
  };
  return (
    <div className="Item">
      <Icon type="plus" onClick={onAdd} />
      <Input key="src" value={src} onChange={handleChange('src')} />
      <Input key="dist" value={dist} onChange={handleChange('dist')} />
      <Icon type="minus" onClick={onRemove} />
    </div>
  );
};

export default Item;
