import ElementPicker from 'html-element-picker';
console.log('asdf Content script loaded');

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
  console.log('asdf Starting element picker');
  elementPicker = new ElementPicker({
    background: 'rgba(255, 0, 0, 0.3)',
    action: {
      trigger: 'click',
      // prettier-ignore
      callback: (function (target) {
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
      }),
    },
  });
};

// Message listener for popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'startSelection') {
    console.log('asdf Starting element selection');
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
