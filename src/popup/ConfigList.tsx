import React from 'react';
import Input from '../components/Input';
import Switch from '../components/Switch';
import Icon from '../components/Icon';
import clsx from 'clsx';
import { I_Config } from './Popup';

type ConfigListProps = {
  list: I_Config[];
  activeIndex: number;
  onActiveChange: (index: number) => void;
  onChange: (index: number, config: I_Config) => void;
  onRemove: (index: number) => void;
};
const ConfigList = ({
  list,
  activeIndex,
  onActiveChange,
  onChange,
  onRemove
}: ConfigListProps) => {
  const rootCls = 'ConfigList';
  const itemCls = `${rootCls}__Item`;
  return (
    <div className={rootCls}>
      {list.map((item, idx) => {
        return (
          <div
            className={clsx(
              itemCls,
              activeIndex === idx && `${itemCls}--selected`
            )}
            onClick={() => onActiveChange(idx)}
            key={idx}
          >
            <Switch
              value={item.isActive}
              size="small"
              onChange={val => {
                onChange(idx, { ...item, isActive: val });
              }}
            />
            <Input
              value={item.name}
              activeTextStyle
              onChange={val => {
                onChange(idx, { ...item, name: val });
              }}
            />
            <Icon type="trash" onClick={() => onRemove(idx)} size="14px" />
          </div>
        );
      })}
    </div>
  );
};

export default ConfigList;
