# Enumerate

A webextensions add-on
([Firefox](https://addons.mozilla.org/en-US/firefox/addon/enumerate/)
or
[Chrome](https://chrome.google.com/webstore/detail/enumerate/ioepadelblgiflhfpilnemfndhmfngpf))
to obtain search results directly from the URL bar.

No need to first go to the search results page (unless you need
more results and their descriptions, etc., in which case, that
is also made available).

For site-specific search (of the site in the current tab), see
[Enumerate-Site](https://github.com/brettz9/enumerate-site).

## Screenshots

![Omnibox search terms](https://raw.githubusercontent.com/brettz9/enumerate/master/screenshots/omnibox-search-terms.png)

![Omnibox selected](https://raw.githubusercontent.com/brettz9/enumerate/master/screenshots/omnibox-selected.png)

## Instructions

1. Type `g` and a space to activate Enumerate.
2. Type your search terms.
3. Use the arrows or mouse to select one of the search results to
    go directly to that page.

## Credits

- Inspired by the work of the Firefox add-on [CyberSearch](http://cybersear.ch/)

## Missing features

There are some limitations in WebExtensions or its implementation by the
browser that our add-on cannot overcome.

1. [Opt in to show more than 6 suggestions](https://bugzilla.mozilla.org/show_bug.cgi?id=1375252)
1. [Make Omnibox keyword overridable](https://bugzilla.mozilla.org/show_bug.cgi?id=1375453)
1. [Avoid need for Omnibox keyword (override)](https://bugzilla.mozilla.org/show_bug.cgi?id=1361327)
1. [DescriptionStyleType](https://bugzilla.mozilla.org/show_bug.cgi?id=1323091) (Firefox lacking Chrome ability to have part of description bold or gray (text) or blue (URLs))
1. [Registering multiple omnibox keywords](https://bugzilla.mozilla.org/show_bug.cgi?id=1478092)
1. [`onDeleteSuggestion`](https://bugzilla.mozilla.org/show_bug.cgi?id=1478095)
1. [Don't display keyword within highlighted](https://bugzilla.mozilla.org/show_bug.cgi?id=1409702) (minor)

## Possible to-dos

1. Populate results based on Mediawiki API (where headers could advertise
    Mediawiki support?)
