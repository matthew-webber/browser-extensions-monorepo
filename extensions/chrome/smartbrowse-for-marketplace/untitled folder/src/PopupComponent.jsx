import React, { useState } from 'react';

const Popup = () => {
  const [actionType, setActionType] = useState('highlight');

  const handleStartSelection = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: 'startSelection',
        actionType,
      });
    });
    window.close();
  };

  const handleOpenOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <div style={{ width: '200px', padding: '10px' }}>
      <select
        value={actionType}
        onChange={(e) => setActionType(e.target.value)}
      >
        <option value="highlight">Highlight</option>
        <option value="hide">Hide</option>
      </select>
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
