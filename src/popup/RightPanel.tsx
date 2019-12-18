import React from 'react';
import Item from '../components/Item';
import { I_Mapper } from './Popup';

type RightPanel = {
  config: I_Mapper[];
  onChange: (config: I_Mapper[]) => void;
};

const RightPanel = ({ config, onChange }: RightPanel) => {
  const handleRemove = (idx: number) => {
    return () => {
      onChange(config.filter((item, i) => i !== idx));
    };
  };
  const handleAdd = () => {
    onChange(config.concat({ src: '', dist: '' }));
  };
  const handleChange = (idx: number) => {
    return (key: string, val: string) => {
      onChange(
        config.map((item, i) => {
          if (idx === i) {
            return { ...item, [key]: val };
          } else {
            return { ...item };
          }
        })
      );
    };
  };
  return (
    <div className="RightPanel">
      <div onClick={handleAdd}>add</div>
      {config.map((item, idx) => {
        return (
          <Item
            key={idx}
            {...item}
            onRemove={handleRemove(idx)}
            onAdd={handleAdd}
            onChange={handleChange(idx)}
          />
        );
      })}
    </div>
  );
};

export default RightPanel;
