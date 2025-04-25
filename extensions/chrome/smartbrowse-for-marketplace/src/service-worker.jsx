chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('effectsEnabled', ({ effectsEnabled }) => {
    if (effectsEnabled === undefined) {
      chrome.storage.local.set({ effectsEnabled: true });
    }
  });
});
