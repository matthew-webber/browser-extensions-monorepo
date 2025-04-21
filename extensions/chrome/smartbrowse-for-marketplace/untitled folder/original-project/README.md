# SmartBrowse for Marketplace

## Description:

A Chrome extension that enables patient Facebook Marketplace users to customize listing UIs by selecting elements or listings and applying actions like hide or highlight based on text or element matches.

## Wants/Needs:

- Store user preferences across sessions with chrome.storage.sync.
- Allow users to click-select page elements and derive a unique CSS selector or use listing URL as identifier.
- Follow modern JavaScript practices (const/let, arrow functions, querySelector).
- Implement UI interactions in the popup or options page for configuring actions.

## Context:

The ideal user persona is a patient deal-hunter on Facebook Marketplace who repeatedly searches for items (e.g., a $200 road bike). They need to flag or hide listings they’ve seen before to avoid wasted time.
Example scenario: User discovers a road bike listing with a hidden flaw; one week later, they see the same item listed again and are about to click it (having forgotten that they'd already viewed and passed on it), but a visual cue injected into the DOM (e.g. giving the listing card a thick red border) by the extension reminds them that they already passed on this exact listing by highlighting or hiding it.
