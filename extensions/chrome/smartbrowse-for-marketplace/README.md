# SmartBrowse for Marketplace

## Description:

A Chrome extension that enables patient Facebook Marketplace users to customize listing UIs by selecting elements or listings and applying actions like hide or highlight based on text or element matches.

## Wants/Needs:

- The extension should allow users to select elements on the page and apply actions to them.
- Users should be able to specify actions such as hiding or highlighting elements based on text or element matches.
- Allow users to click-select page elements which will then be passed to the extension for further processing and classification.
- When an element is clicked/selected, the extension should further prompt the user to classify the element (e.g., "hide", "highlight", or "blur").
    - Note: since the extension will be used on Facebook Marketplace, and the cards which will be clicked act as links, the extension should prevent this from happening while the user is selecting elements.
- The extension should be able to store the selected element's item number (found in the `href` attribute -- e.g. `href="/marketplace/item/630345633312939/..."`, retrieving `630345633312939`) and the action taken (e.g., "hide", "highlight", or "blur") in `chrome.storage.local`.
- The extension should cancel the selection process if the user clicks outside the selected element, if they end the selection process by clicking the button from the popup window again, or if the user presses the "Esc" key.
- The extension should be able to retrieve the stored elements and actions from `chrome.storage.local` and apply them to the page when it loads.
- The extension should be able to listen for changes in the DOM (e.g., new listings being added) and apply the stored actions to the new elements.
- The extension should be able to inject CSS styles into the page to highlight or hide elements.
- Follow modern JavaScript practices (const/let, arrow functions, querySelector).

## Context:

The ideal user persona is a patient deal-hunter on Facebook Marketplace who repeatedly searches for items (e.g., a $200 road bike). They need to flag or hide listings they’ve seen before to avoid wasted time.
Example scenario: User discovers a road bike listing with a hidden flaw; one week later, they see the same item listed again and are about to click it (having forgotten that they'd already viewed and passed on it), but a visual cue injected into the DOM (e.g. giving the listing card a thick red border) by the extension reminds them that they already passed on this exact listing by highlighting or hiding it.
