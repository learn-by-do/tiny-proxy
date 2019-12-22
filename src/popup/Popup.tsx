import React, { useState, useEffect } from 'react';
import ConfigList from './ConfigList';
import RightPanel from './RightPanel';
import './index.scss';
import { sendMessage } from '../common/communication';
import { STORE_CONFIG_KEY } from '../common/const';
import Icon from '../components/Icon';
import Light from '../components/Light';
import { ACTION } from '../background';

const initData: I_Config[] = [
  // {
  //   name: '第1组配置',
  //   isActive: false,
  //   config: [
  //     { src: 'www.google.com', dist: 'localhost:30001' },
  //     { src: 'www.baidu.com', dist: 'localhost:9001' }
  //   ]
  // },
  // {
  //   name: '第2组配置',
  //   isActive: true,
  //   config: [{ src: '/google.com/i', dist: 'localhost:8080' }]
  // }
];

export interface I_Mapper {
  src: string;
  dist: string;
}

export interface I_Config {
  name: string;
  isActive: boolean;
  config: I_Mapper[];
}

const Popup = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAllDisabled, setIsAllDisabled] = useState(true);
  const [data, setData] = useState<I_Config[]>(initData);

  useEffect(() => {
    chrome.storage.sync.get([STORE_CONFIG_KEY], function(result) {
      const storeConfig = result[STORE_CONFIG_KEY] || {};
      console.log('Value currently is ' + storeConfig);
      const data = storeConfig.data || [];
      setData(data);
      setIsAllDisabled(storeConfig.flag);
    });
  }, []);
  const handleChange = (selectedIdx: number, payload: I_Config) => {
    doChange(
      data.map((item, idx) => {
        return selectedIdx === idx ? payload : item;
      })
    );
  };
  const doChange = (data: I_Config[]) => {
    setData(data);
  };

  const handleConfigChange = (config: I_Mapper[]) => {
    doChange(
      data.map((item, idx) => {
        return activeIndex === idx ? { ...item, config } : item;
      })
    );
  };

  const handleRemove = (selectedIdx: number) => {
    doChange(data.filter((_, idx) => selectedIdx !== idx));
  };

  const handleAdd = () => {
    doChange(data.concat({ name: '', isActive: false, config: [] }));
  };

  const handleSave = () => {
    sendMessage(ACTION.SAVE_DATA, data);
  };

  const toggleDisableAll = (val: boolean) => {
    setIsAllDisabled(val);
    val && sendMessage({ type: ACTION.ENABLE_PROXY, data });
  };
  return (
    <div className="Popup">
      <div className="LeftPanel">
        <div className="Popup__Head">
          <Light
            value={isAllDisabled}
            onChange={toggleDisableAll}
            title={isAllDisabled ? '全部开启' : '全部关闭'}
          />
          <Icon type="save" onClick={handleSave} title="保存配置" />
          <Icon type="plus" onClick={handleAdd} title="新增配置" />
        </div>
        <ConfigList
          activeIndex={activeIndex}
          onChange={handleChange}
          onRemove={handleRemove}
          list={data}
          onActiveChange={(idx: number) => setActiveIndex(idx)}
        />
      </div>

      {data[activeIndex] && (
        <RightPanel
          onChange={handleConfigChange}
          config={data[activeIndex].config || []}
        />
      )}
    </div>
  );
};

export default Popup;
