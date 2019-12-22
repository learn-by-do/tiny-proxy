import React from 'react';
import './index.scss';

type TextArea = {
  value: string;
  onChange: (val: string) => void;
};

const TextArea = ({ value, onChange }: TextArea) => {
  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = event => {
    onChange(event.target.value);
  };
  return (
    <div className="TextArea">
      <textarea value={value} onChange={handleChange}></textarea>
    </div>
  );
};

export default TextArea;
