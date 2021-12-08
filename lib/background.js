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

// Removing default doesn't help expand number of search results
browser.omnibox.setDefaultSuggestion({
    description: _('Type_your_search_terms')
});

/**
 * Escaping of description required by Chrome (not by Firefox)
 * @param {string} url
 */
function escapeXML (url) {
    return url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

browser.omnibox.onInputChanged.addListener(async (input, suggest) => {
    const {noFullSearchResultsLink} = await browser.storage.local.get('noFullSearchResultsLink');
    const numSuggestions = noFullSearchResultsLink ? 5 : 4;

    try {
        const searchURL = `https://www.google.com/search?q=${input}&ie=utf-8&oe=utf-8`;
        // Do we want any `Request` options?
        const req = new Request(searchURL); // https://developer.mozilla.org/en-US/docs/Web/API/Request
        const resp = await fetch(req);
        const html = await resp.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        // console.log('doc', doc && doc.documentElement && doc.documentElement.outerHTML);

        const results = [];
        const links = [...doc.querySelectorAll('*:not(li) > h3')]; // [href][onmousedown]:not([href^="#"]):not([href^="https://webcache"]):not([href^="http://webcache"])
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
        links.some((link, i) => {
            if (results.length >= numSuggestions) {
                return true;
            }
            if (link.parentNode.matches('a[href]')) {
                link = link.parentNode;
            } else {
                link = link.querySelector('a[href]');
            }
            if (!link || link.style.display === 'none') {
                return false;
            }
            const url = new URL(link.getAttribute('href'), searchURL).href; // Doing `link.href` (at least in Firefox) gets us a path relative to the extension which we don't want
            const title = link.textContent;
            // console.log('title', title, link.outerHTML);
            // const description = descriptions[i];
            // https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/omnibox/SuggestResult
            results.push({
                // URL separated by (title and?) description
                // Was showing URL and title, but as Firefox was showing cursor at end of line, one couldn't see the URL
                // content: _('result_content', [url, title, description]), // This value will show when highlighted within list
                content: url,
                // Show title and URL
                description: escapeXML(_('result_description', [url, title])) // This is what shows for each list item
            });
            return false;
        });
        if (!noFullSearchResultsLink) {
            results.push({
                content: searchURL,
                description: escapeXML(_('full_search_results', [searchURL]))
            });
        }
        // console.log('results', JSON.stringify(results));
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
