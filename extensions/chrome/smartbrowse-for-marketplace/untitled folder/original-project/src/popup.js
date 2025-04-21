document.getElementById('startSelection').addEventListener('click', () => {
  const actionType = document.getElementById('actionType').value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({
      action: 'startSelection',
      actionType: actionType,
    });
    window.close();
  });
});

document.getElementById('openOptions').addEventListener('click', () => {
  chrome.runtime.openOptionsPage();
});
