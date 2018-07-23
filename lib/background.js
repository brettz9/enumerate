/* eslint-env webextensions */

function _ (...args) {
    return browser.i18n.getMessage(...args);
}

browser.omnibox.onInputStarted.addListener(() => {
    console.log('Omnibox use started');
});
browser.omnibox.onInputCancelled.addListener(() => {
    console.log('Omnibox cancelled');
});

browser.omnibox.setDefaultSuggestion({
    description: _('Type_your_search_terms')
});

browser.omnibox.onInputChanged.addListener(async (input, suggest) => {
    const req = new Request(
        `https://www.google.com/search?q=${input}&ie=utf-8&oe=utf-8`
    ); // https://developer.mozilla.org/en-US/docs/Web/API/Request
    const resp = await fetch(req);
    const html = await resp.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // Todo: Finish
    const links = doc.querySelectorAll('a[href][onmousedown]');
    const results = [];
    // Displays first six
    results.push(
        // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/omnibox/SuggestResult
        {
            // Todo: Include URL separated by (title and?) description
            content: '', // This value will show when highlighted within list
            // Todo: Show title and URL
            description: '' // This is what shows for each list item
        }
    );
    suggest(results);
});

browser.omnibox.onInputEntered.addListener((url, disposition) => {
    // `url` matches the `content` above
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/omnibox/OnInputEnteredDisposition
    url = url.replace(/ .*$/, '');
    switch (disposition) {
    case 'currentTab':
        browser.tabs.update({url});
        break;
    case 'newForegroundTab':
        browser.tabs.create({url});
        break;
    case 'newBackgroundTab':
        browser.tabs.create({url, active: false});
        break;
    }
});
