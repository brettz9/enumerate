/* eslint-env browser, webextensions */
import {jml, body} from './jml.js';

function _ (...args) {
    return browser.i18n.getMessage(...args);
}

document.title = _('extensionName'); // If switch to tabs
(async () => {
jml('section', await Promise.all([
    ['noFullSearchResultsLink']
].map(async ([preferenceKey]) => {
    let enabled = false;
    try {
        ({[preferenceKey]: enabled = false} = await browser.storage.local.get(preferenceKey));
    } catch (err) {}
    return ['label', [
        ['input', {
            type: 'checkbox',
            checked: enabled,
            $on: {
                async change ({target}) {
                    await browser.storage.local.set({
                        [preferenceKey]: target.checked
                    });
                }
            }
        }],
        ' ',
        _(preferenceKey + '_title'),
        ['section', {class: 'addon-description'}, [
            _(preferenceKey + '_description')
        ]],
        ['br']
    ]];
})), body);
})();
