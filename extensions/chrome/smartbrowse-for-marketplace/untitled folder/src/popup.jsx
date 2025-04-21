import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';

const Popup = () => {
  const [actionType, setActionType] = useState('highlight');
  console.log('asdf WASSUUP');

  const handleStartSelection = () => {
    chrome.runtime.sendMessage({
      action: 'startSelection',
      actionType,
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

// Use React 18+ rendering API
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Popup />);
