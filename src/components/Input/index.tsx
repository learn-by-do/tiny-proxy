import React, { useState, useRef } from 'react';
import './index.scss';

type InputProps = {
  value: string;
  onChange: (val: string) => void;
  activeTextStyle?: boolean;
};

const Input = ({ value, onChange, activeTextStyle = false }: InputProps) => {
  const [readOnly, setReadOnly] = useState(activeTextStyle);
  const ref = useRef<HTMLInputElement>(null!);
  const handleDbClick = () => {
    setReadOnly(false);
    const selection = window.getSelection()!;
    if (activeTextStyle) {
      selection.removeAllRanges();
      ref.current.focus();
      ref.current.setSelectionRange(-1, -1);
    }
  };
  const handleBlur = () => {
    activeTextStyle && setReadOnly(true);
    // onBlur && onBlur();
  };
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    onChange && onChange(event.target.value);
  };
  return (
    <input
      ref={ref}
      value={value}
      readOnly={readOnly}
      onDoubleClick={handleDbClick}
      onBlur={handleBlur}
      onChange={handleChange}
      title={value}
      className={'Input' + (readOnly ? ' Input--readonly' : '')}
    />
  );
};

export default Input;
