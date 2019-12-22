//TODO: not used now
export function notify(msg: string, title = '', alwaysShow = false) {
  chrome.notifications.getPermissionLevel(level => {
    console.log('level: ', level);
  });
  chrome.notifications.create('error', {
    iconUrl: '/images/icon48.png',
    type: 'basic',
    title: title,
    message: msg,
    requireInteraction: alwaysShow
  });
}

export const { sendMessage } = chrome.runtime;
