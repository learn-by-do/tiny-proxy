import React, { useState, useEffect } from 'react';
import Item from '../components/Item';
import TextArea from '../components/TextArea';
import { I_Mapper } from './Popup';
import Tabs from '../components/Tabs';

type RightPanel = {
  config: I_Mapper[];
  onChange: (config: I_Mapper[]) => void;
};

const RightPanel = ({ config, onChange }: RightPanel) => {
  const [isTextView, toggleTextView] = useState(false);
  // const [configText, setConfigText] = useState('');

  // useEffect(() => {
  //   setConfigText(config.map(item => `${item.src} ${item.dist}`).join('\n'));
  // }, [config]);
  const configText = config
    .map(
      item =>
        `${item.src || ''}${item.dist === undefined ? '' : ' '}${item.dist ||
          ''}`
    )
    .join('\n');

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
  const handleTextChange = (val: string) => {
    const newConfig: I_Mapper[] = [];
    for (const line of val.split(/\r?\n/)) {
      const [src, dist] = line.split(/ +/);
      newConfig.push({ src, dist });
    }
    onChange(newConfig);
  };

  return (
    <div className="RightPanel">
      <Tabs
        tabs={[{ text: 'UI 视图' }, { text: '文本视图' }]}
        onChange={(idx: number) => toggleTextView(idx === 1)}
      />
      <div className="RightPanel__Body">
        {isTextView ? (
          <TextArea value={configText} onChange={handleTextChange} />
        ) : config.length ? (
          config.map((item, idx) => {
            return (
              <Item
                key={idx}
                {...item}
                onRemove={handleRemove(idx)}
                onAdd={handleAdd}
                onChange={handleChange(idx)}
              />
            );
          })
        ) : (
          <button onClick={handleAdd}>add</button>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
