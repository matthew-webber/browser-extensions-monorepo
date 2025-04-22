import ElementPicker from 'html-element-picker';
console.log('Content script loaded');

let elementPicker = null;
let selectionActive = false;
let clickInterceptor = null;
let escListener = null;

// Utility to stop selection mode
const stopElementPicker = () => {
  console.log('Stopping element picker');
  document.removeEventListener('mousemove', elementPicker._detectMouseMove);

  // 2. detach trigger listener (e.g. click)
  document.removeEventListener(
    elementPicker.action.trigger,
    elementPicker._triggerListener
  );

  // 3. remove the hoverBox element
  elementPicker.hoverBox.remove();

  elementPicker = null;
  selectionActive = false;
  if (clickInterceptor) {
    document.removeEventListener('click', clickInterceptor, true);
    clickInterceptor = null;
  }
  if (escListener) {
    document.removeEventListener('keydown', escListener, true);
    escListener = null;
  }
  selectionActive = false;
};

// Apply stored preferences on load and on DOM mutations
const applyPreferences = async () => {
  const { preferences = [] } = await chrome.storage.local.get('preferences');
  preferences.forEach((pref) => {
    document
      .querySelectorAll(`a[href*="/item/${pref.itemId}/"]`)
      .forEach((el) => {
        if (pref.action === 'hide') el.style.display = 'none';
        if (pref.action === 'highlight') el.style.outline = '2px solid red';
        if (pref.action === 'blur') el.style.filter = 'blur(4px)';
      });
  });
};
applyPreferences();
new MutationObserver(applyPreferences).observe(document.body, {
  subtree: true,
  childList: true,
});

// Start selection mode
const startElementPicker = () => {
  selectionActive = true;
  // Prevent normal link clicks
  clickInterceptor = (e) => {
    // e.preventDefault();
    // e.stopPropagation();
  };
  document.addEventListener('click', clickInterceptor, true);

  // Allow Esc to cancel
  escListener = (e) => {
    if (e.key === 'Escape') stopElementPicker();
  };
  document.addEventListener('keydown', escListener, true);

  elementPicker = new ElementPicker({
    background: 'rgba(255, 0, 0, 0.3)',
    action: {
      trigger: 'click',
      callback: (target) => {
        console.log('Element clicked:', target);
        // Show custom action selection popup
        const { top, left, width, height } = target.getBoundingClientRect();
        const popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.top = `${top + window.scrollY + height + 8}px`;
        popup.style.left = `${left + window.scrollX}px`;
        popup.style.background = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.padding = '8px';
        popup.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        popup.style.zIndex = '100000';
        ['hide', 'highlight', 'blur'].forEach((act) => {
          const btn = document.createElement('button');
          btn.textContent = act;
          btn.style.margin = '0 4px';
          btn.addEventListener('click', () => {
            const action = act;
            // Try to extract Marketplace itemId from nearest <a>
            let itemId = null;
            const link = target.closest('a');
            if (link && link.href) {
              const match = link.href.match(/\/item\/(\d+)\//);
              if (match) itemId = match[1];
            }
            // Store in local storage
            chrome.storage.local.get({ preferences: [] }, ({ preferences }) => {
              chrome.storage.local.set({
                preferences: [
                  ...preferences,
                  { itemId, action, timestamp: Date.now() },
                ],
              });
            });
            // Cleanup
            popup.remove();
            stopElementPicker();
          });
          popup.appendChild(btn);
        });
        document.body.appendChild(popup);
      },
    },
  });
};

// Listen for popup messages
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'startSelection') {
    if (selectionActive) {
      stopElementPicker();
    } else {
      startElementPicker();
    }
  }
});
