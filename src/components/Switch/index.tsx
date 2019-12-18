import React, { ChangeEvent } from 'react';
import './index.scss';
import clsx from 'clsx';

type SwitchProps = {
  onChange: (val: boolean) => void;
  value: boolean;
  size?: string;
  title?: string;
};

const Switch = ({
  onChange,
  value,
  size = 'normal',
  title = ''
}: SwitchProps) => {
  const handleChange: React.EventHandler<ChangeEvent<
    HTMLInputElement
  >> = event => {
    onChange && onChange(event.target.checked);
  };
  return (
    <label className={clsx('Switch', `Switch--${size}`)} title={title}>
      <input
        className="Checkbox"
        checked={value}
        type="checkbox"
        onChange={handleChange}
      />
      <span className="Slider" />
    </label>
  );
};

export default Switch;
