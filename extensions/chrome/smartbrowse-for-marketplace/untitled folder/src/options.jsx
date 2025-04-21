import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const Options = () => {
  const [preferences, setPreferences] = useState([]);

  useEffect(() => {
    chrome.storage.sync.get('preferences', ({ preferences = [] }) => {
      setPreferences(preferences);
    });
  }, []);

  const handleDelete = (index) => {
    const newPreferences = preferences.filter((_, i) => i !== index);
    chrome.storage.sync.set({ preferences: newPreferences });
    setPreferences(newPreferences);
  };

  return (
    <div style={{ width: '400px', padding: '10px' }}>
      <h2>Saved Preferences</h2>
      <div>
        {preferences.map((pref, i) => (
          <div
            key={i}
            style={{
              margin: '5px 0',
              padding: '5px',
              border: '1px solid #ccc',
            }}
          >
            <b>{pref.action}</b>: {pref.selector}
            <button onClick={() => handleDelete(i)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Options />);
