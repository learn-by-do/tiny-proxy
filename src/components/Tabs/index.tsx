import React, { useState } from 'react';
import './index.scss';
import clsx from 'clsx';

type TabProps = {
  isActive?: boolean;
  text: string;
  id: number;
};

type TabsProps = {
  activeIdx?: number;
  tabs: { text: string }[];
  onChange: (idx: number) => void;
};

const Tab = ({ isActive = false, text, id }: TabProps) => {
  return (
    <div className={clsx('Tab', isActive && 'Tab--active')} data-id={id}>
      {text}
    </div>
  );
};

const Tabs = ({ activeIdx = 0, tabs, onChange }: TabsProps) => {
  const [activeId, setActiveId] = useState(activeIdx);

  const handleClick: React.MouseEventHandler<HTMLDivElement> = event => {
    const id = Number((event.target as HTMLButtonElement).dataset.id);
    if (id >= 0 && id < tabs.length) {
      setActiveId(id);
      onChange(id);
    }
  };
  return (
    <div className="Tabs" onClick={handleClick}>
      {tabs.map((tab, idx) => (
        <Tab text={tab.text} isActive={activeId === idx} key={idx} id={idx} />
      ))}
    </div>
  );
};

export default Tabs;
