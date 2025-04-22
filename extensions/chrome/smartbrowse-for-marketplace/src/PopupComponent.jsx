import React from 'react';

const Popup = () => {
  const handleStartSelection = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'startSelection',
      });
    });
    window.close();
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div style={{ width: '200px', padding: '10px' }}>
      <button
        onClick={handleStartSelection}
        style={{ width: '100%', margin: '5px 0' }}
      >
        Start Element Selection
      </button>
      <button
        onClick={handleOpenOptions}
        style={{ width: '100%', margin: '5px 0' }}
      >
        Options
      </button>
    </div>
  );
};

export default Popup;
