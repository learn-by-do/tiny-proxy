import { sendMessage, notify } from './common/communication';

import { STORE_CONFIG_KEY, noop } from './common/const';
import { I_Config } from './popup/Popup';
import ConfigList from './popup/ConfigList';

type I_Data = {
  data: I_Config[];
  flag: boolean;
};

let config: I_Data = {
  flag: false,
  data: []
};

export const ACTION = {
  SAVE_DATA: 'saveData',
  DISABLE_PROXY: 'disableProxy',
  ENABLE_PROXY: 'enableProxy',
  LOG: 'log'
};

const isIP = (address: string) =>
  /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(address);

const isHostname = (hostname: string) =>
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(
    hostname
  );

chrome.runtime.onMessage.addListener(function(
  { type, payload, from },
  callback
) {
  if (typeof payload === 'string') {
    log(payload, from);
  } else {
    HUB[type](payload);
  }
});

const colorMap: { [key: string]: string } = {
  bg: 'color: blue',
  popup: 'color: green'
};
function log(msg: string, from = 'bg') {
  console.log(`%c [${from}]: ${msg}`, colorMap[from]);
}

const HUB: { [key: string]: (payload: I_Data) => void } = {
  disableProxy,
  enableProxy,
  saveData
};

// ==== WebRequest way ====
function getPatterns() {
  let res = [];
  res = config.data.reduce((patterns, item) => {
    if (item.isActive) {
      for (let conf of item.config) {
        const { src } = conf;
        if (src) {
          patterns.push(isHostname(src) ? `*://${src}/*` : src);
        }
      }
    }
    return patterns;
  }, [] as string[]);
  return res;
}

function redirect({ url }: chrome.webRequest.WebRequestBodyDetails) {
  const matches = /https?:\/\/(.*?)(\/.*)/gi.exec(url);

  for (let item of config.data) {
    if (item.isActive) {
      for (let conf of item.config) {
        const { src, dist } = conf;
        let reg = null;
        try {
          reg = new RegExp(src.replace(/\*/g, '.*'));
        } catch (e) {
          continue;
        }

        if (reg.test(url)) {
          const newUrl = url.replace(isIP(dist) ? src : reg, dist);
          return { redirectUrl: newUrl };
        }
      }
    }
  }
}

function saveData(payload: I_Data) {
  config = { ...payload };
  chrome.storage.sync.set({ [STORE_CONFIG_KEY]: payload }, function() {
    log('value is saved: ' + JSON.stringify(payload));
  });
}

function enableProxy(payload: I_Data) {
  saveData(payload);
  updateBadge();
  removeListener();
  const patterns = getPatterns();
  patterns.length &&
    chrome.webRequest.onBeforeRequest.addListener(
      redirect,
      {
        urls: patterns
      },
      ['blocking']
    );
}

function disableProxy() {
  config.flag = false;
  updateBadge();
  chrome.storage.sync.set({ [STORE_CONFIG_KEY]: config }, function() {
    log('disabled proxy');
  });
  removeListener();
}

function removeListener() {
  if (chrome.webRequest.onBeforeRequest.hasListener(redirect)) {
    chrome.webRequest.onBeforeRequest.removeListener(redirect);
  }
}


function updateBadge() {
  const { flag } = config;
  chrome.browserAction.setBadgeText({ text: flag ? 'ON' : 'OFF' });
  chrome.browserAction.setBadgeBackgroundColor({
    color: flag ? [44, 232, 106, 255] : [204, 204, 204, 255]
  });
}

function startup() {
  chrome.storage.sync.get(STORE_CONFIG_KEY, function(results) {
    if (results) {
      config = { data: results.data || [], flag: results.flag || false };
    }
    updateBadge();
  });

  chrome.webNavigation.onCommitted.addListener(updateBadge);
}
startup();
