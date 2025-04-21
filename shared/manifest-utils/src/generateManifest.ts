export function generateManifest(browser: 'chrome' | 'firefox') {
  const base = {
    name: "Clipper Extension",
    version: "1.0.0",
    description: "Cross-browser extension",
    permissions: ["storage"],
    action: {
      default_popup: "popup.html"
    }
  };
  return { ...base, manifest_version: browser === 'chrome' ? 3 : 2 };
}
