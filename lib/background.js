/* eslint-env webextensions */

function _ (...args) {
    return browser.i18n.getMessage(...args);
}

/*
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/omnibox
browser.omnibox.onInputStarted.addListener(() => {
    console.log('Omnibox use started');
});
browser.omnibox.onInputCancelled.addListener(() => {
    console.log('Omnibox cancelled');
});
*/

const numSuggestions = 4;
// Removing default doesn't help
browser.omnibox.setDefaultSuggestion({
    description: _('Type_your_search_terms')
});

browser.omnibox.onInputChanged.addListener(async (input, suggest) => {
    try {
        const searchURL = `https://www.google.com/search?q=${input}&ie=utf-8&oe=utf-8`;
        // Do we want any `Request` options?
        const req = new Request(searchURL); // https://developer.mozilla.org/en-US/docs/Web/API/Request
        const resp = await fetch(req);
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        // console.log('doc', doc && doc.documentElement && doc.documentElement.outerHTML);

        const links = [...doc.querySelectorAll('h3 > a')].slice(0, numSuggestions); // [href][onmousedown]:not([href^="#"]):not([href^="https://webcache"]):not([href^="http://webcache"])
        // console.log('links', links);
        /*
        // Could use these for slightly cleaner URL (e.g., no "http://")
        const cites = links.map((link) => {
            return link.parentNode.nextElementSibling.querySelector('cite');
        });
        */
        /*
        const descriptions = links.map((link) => {
            const container = link.parentNode.nextElementSibling;
            let span;
            if (container) {
                span = container.querySelector('span.st');
            }
            return span
                ? span.textContent
                : '';
        });
        */
        // console.log('descriptions', descriptions);
        // First six only will be displayed
        const results = links.map((link, i) => {
            const url = new URL(link.getAttribute('href'), searchURL).href; // Doing `link.href` gets us relative to the extension which we don't want
            const title = link.textContent;
            // const description = descriptions[i];
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/omnibox/SuggestResult
            return {
                // URL separated by (title and?) description
                // Was showing URL and title, but as Firefox was showing cursor at end of line, one couldn't see the URL
                // content: _('result_content', [url, title, description]), // This value will show when highlighted within list
                content: url,
                // Show title and URL
                description: _('result_description', [url, title]) // This is what shows for each list item
            };
        });
        results.push({
            content: searchURL,
            description: _('full_search_results', [searchURL])
        });
        suggest(results);
    } catch (err) {
        console.log('err', err.toString());
    }
});

browser.omnibox.onInputEntered.addListener((url, disposition) => {
    // `url` matches the `content` above
    // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/omnibox/OnInputEnteredDisposition
    // url = url.replace(/ .*$/, '');
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
