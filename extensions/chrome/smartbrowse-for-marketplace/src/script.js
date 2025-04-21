// Inject element picker library
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/html-element-picker@latest';

document.head.appendChild(script);

let elementPicker = null;
let currentAction = 'highlight';

// Generate CSS selector for element
const getSelector = (el) => {
  const path = [];
  while (el && el !== document.body) {
    let selector = el.tagName.toLowerCase();
    if (el.id) {
      selector += `#${el.id}`;
      path.unshift(selector);
      break;
    } else {
      let sib = el,
        nth = 1;
      while ((sib = sib.previousElementSibling)) {
        if (sib.tagName === el.tagName) nth++;
      }
      if (nth !== 1) selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    el = el.parentElement;
  }
  return path.join(' > ');
};

// Apply stored actions
const applyPreferences = async () => {
  const { preferences = [] } = await chrome.storage.sync.get('preferences');
  preferences.forEach((pref) => {
    document.querySelectorAll(pref.selector).forEach((el) => {
      if (pref.action === 'hide') el.style.display = 'none';
      if (pref.action === 'highlight') el.style.outline = '2px solid red';
    });
  });
};

// Initialize element picker with user action
const startElementPicker = () => {
  elementPicker = new ElementPicker({
    background: 'rgba(255, 0, 0, 0.3)',
    action: {
      trigger: 'click',
      callback: function (target) {
        const selector = getSelector(target);
        chrome.storage.sync.get('preferences', ({ preferences = [] }) => {
          chrome.storage.sync.set({
            preferences: [
              ...preferences,
              {
                selector,
                action: currentAction,
                timestamp: Date.now(),
              },
            ],
          });
        });
        elementPicker.destroy();
      },
    },
  });
};

// Message listener for popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'startSelection') {
    currentAction = msg.actionType;
    startElementPicker();
  }
});

// Apply preferences on load and DOM changes
applyPreferences();
new MutationObserver(applyPreferences).observe(document.body, {
  subtree: true,
  childList: true,
});
