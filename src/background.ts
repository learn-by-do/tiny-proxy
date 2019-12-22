import { sendMessage, notify } from './common/communication';

import { STORE_CONFIG_KEY, noop } from './common/const';
import { I_Config } from './popup/Popup';

export const ACTION = {
  SAVE_DATA: 'saveData',
  DISABLE_PROXY: 'disableProxy',
  ENABLE_PROXY: 'enableProxy',
}

chrome.runtime.onMessage.addListener(function({ type, data }, callback) {
  HUB[`${type}Proxy`](data);
});

const HUB: { [key: string]: (data: I_Config[]) => void } = {
  disableProxy,
  enableProxy,
  saveData
};

let configData: I_Config[] = [];
let configFlag = false;

// ==== WebRequest way ====
const isIP = (address: string) =>
  /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/.test(address);

const isHostname = (hostname: string) =>
  /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/.test(
    hostname
  );
function getPatterns() {
  let res = [];
  res = configData.reduce((patterns, item) => {
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

  for (let item of configData) {
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
          console.log('>>>', url, newUrl, src, dist);
          return { redirectUrl: newUrl };
        }
      }
    }
  }
}

function saveData(data: I_Config[]) {
  configData = data;
  chrome.storage.sync.set(
    { [STORE_CONFIG_KEY]: { flag: configFlag, data: configData } },
    function() {
      console.log('Value is set to ' + data);
    }
  );
}

function enableProxy(data: I_Config[]) {
  saveData(data);
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
  chrome.storage.sync.set(
    { [STORE_CONFIG_KEY]: { flag: configFlag, data: configData } },
    function() {
      console.log('disabled proxy');
    }
  );
  removeListener();
}

function removeListener() {
  if (chrome.webRequest.onBeforeRequest.hasListener(redirect)) {
    chrome.webRequest.onBeforeRequest.removeListener(redirect);
  }
}

startup();

function startup() {
  chrome.storage.sync.get(STORE_CONFIG_KEY, function(results) {

  });
}

// ==== proxy ways ====
function setProxy(cb = noop) {
  const config = {
    mode: 'pac_script',
    pacScript: {
      data:
        'function FindProxyForURL(url, host) {\n' +
        "  if (host == 'foobar.com')\n" +
        "    return 'PROXY blackhole:80';\n" +
        "  return 'DIRECT';\n" +
        '}'
    }
  };
  chrome.proxy.settings.set({ value: config, scope: 'regular' }, cb);
}

function resetProxy(cb = noop) {
  chrome.proxy.settings.clear({ scope: 'regular' }, cb);
}
