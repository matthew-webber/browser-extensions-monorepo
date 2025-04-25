import React, { useState, useEffect } from 'react';

const Popup = () => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    chrome.storage.local.get('effectsEnabled', ({ effectsEnabled }) => {
      setEnabled(effectsEnabled ?? true);
    });
  }, []);

  const handleToggle = () => {
    chrome.storage.local.set({ effectsEnabled: !enabled });
    setEnabled(!enabled);
  };

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

      <div style={{ margin: '8px 0' }}>
        <label>
          <input type="checkbox" checked={enabled} onChange={handleToggle} />
          Enable effects
        </label>
      </div>
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
