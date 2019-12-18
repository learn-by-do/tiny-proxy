import React from 'react';
import './index.scss';
import clsx from 'clsx';

type LightProps = {
  value: boolean;
  size?: string;
  onChange: (val: boolean) => void;
  title?: string;
};

const baseCls = 'Light';
const Light = ({ value, onChange, size, title = '' }: LightProps) => {
  return (
    <span
      className={clsx(baseCls, value && `${baseCls}--on`)}
      style={{ width: size, height: size }}
      onClick={() => onChange(!value)}
      title={title}
    ></span>
  );
};

export default Light;
