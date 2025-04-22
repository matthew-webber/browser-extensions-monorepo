import ElementPicker from 'html-element-picker';
console.log('Content script loaded');

let elementPicker = null;
let selectionActive = false;
let clickInterceptor = null;
let escListener = null;

// Utility to stop selection mode
const stopElementPicker = () => {
  // Remove link-disabling CSS
  const disableLinksStyle = document.getElementById(
    'smartbrowse-disable-links'
  );
  if (disableLinksStyle) {
    disableLinksStyle.remove();
  }
  console.log('Stopping element picker');
  document.removeEventListener('mousemove', elementPicker._detectMouseMove);

  // 2. detach trigger listener (e.g. mousedown)
  document.removeEventListener(
    elementPicker.action.trigger,
    elementPicker._triggerListener
  );

  // 3. remove the hoverBox element
  elementPicker.hoverBox.remove();

  elementPicker = null;
  selectionActive = false;
  if (clickInterceptor) {
    document.removeEventListener('mousedown', clickInterceptor, true);
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
  console.log('BOOP BOOP BOOP');
  selectionActive = true;
  // Disable Marketplace link clicks via CSS pointer-events
  const disableLinksStyle = document.createElement('style');
  disableLinksStyle.id = 'smartbrowse-disable-links';
  disableLinksStyle.textContent =
    'a[href*="/item/"] { pointer-events: none !important; }';
  document.head.appendChild(disableLinksStyle);

  // Allow Esc to cancel
  escListener = (e) => {
    if (e.key === 'Escape') stopElementPicker();
  };
  document.addEventListener('keydown', escListener, true);

  elementPicker = new ElementPicker({
    background: 'rgba(255, 0, 0, 0.3)',
    action: {
      trigger: 'mousedown',
      callback: (target) => {
        console.log('Element clicked:', target);
        // Create translucent overlay over the clicked card
        const { top, left, width, height } = target.getBoundingClientRect();
        const overlay = document.createElement('div');
        overlay.style.position = 'absolute';
        overlay.style.top = `${top + window.scrollY}px`;
        overlay.style.left = `${left + window.scrollX}px`;
        overlay.style.width = `${width}px`;
        overlay.style.height = `${height}px`;
        overlay.style.background = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.zIndex = '100000';

        // Container for buttons
        const container = document.createElement('div');
        container.style.background = '#fff';
        container.style.padding = '8px';
        container.style.borderRadius = '4px';
        container.style.display = 'flex';
        container.style.gap = '8px';

        ['hide', 'highlight', 'blur'].forEach((act) => {
          const btn = document.createElement('button');
          btn.textContent = act;
          btn.addEventListener('click', () => {
            const action = act;
            // Extract itemId from nearest link
            let itemId = null;
            const link = target.querySelector('a');
            if (link && link.href) {
              const match = link.href.match(/\/item\/(\d+)\//);
              if (match) itemId = match[1];
            }
            // Store preference
            chrome.storage.local.get({ preferences: [] }, ({ preferences }) => {
              chrome.storage.local.set({
                preferences: [
                  ...preferences,
                  { itemId, action, timestamp: Date.now() },
                ],
              });
            });
            // Cleanup
            overlay.remove();
          });
          container.appendChild(btn);
        });

        overlay.appendChild(container);
        document.body.appendChild(overlay);
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
