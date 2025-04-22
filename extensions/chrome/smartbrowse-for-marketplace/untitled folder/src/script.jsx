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
        // Prompt user for the desired action
        const action = window.prompt(
          'Enter action to apply (hide, highlight, blur):',
          'hide'
        );
        if (!action || !['hide', 'highlight', 'blur'].includes(action)) {
          alert('Invalid action—selection canceled.');
          stopElementPicker();
          return;
        }
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
        stopElementPicker();
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
