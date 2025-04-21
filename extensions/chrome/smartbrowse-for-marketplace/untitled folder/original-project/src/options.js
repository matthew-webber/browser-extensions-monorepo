const renderPreferences = (prefs) => {
  const container = document.getElementById('preferences');
  container.innerHTML = prefs
    .map(
      (pref, i) => `
      <div class="pref-item">
        <b>${pref.action}</b>: ${pref.selector}
        <button data-index="${i}">Delete</button>
      </div>
    `
    )
    .join('');

  container.querySelectorAll('button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const newPrefs = prefs.filter(
        (_, i) => i !== parseInt(btn.dataset.index)
      );
      chrome.storage.sync.set({ preferences: newPrefs });
      renderPreferences(newPrefs);
    });
  });
};

chrome.storage.sync.get('preferences', ({ preferences = [] }) => {
  renderPreferences(preferences);
});
