# Enumerate

A webextensions add-on
([Firefox](https://addons.mozilla.org/en-US/firefox/addon/enumerate/)
or Chrome (pending approval)) <!--
[Chrome]())
--> to obtain search results directly from the URL bar. No need to first go to
the search results page (unless you need more results and their descriptions,
etc., in which case, that is also made available).

## Screenshots

![Omnibox search terms](https://raw.githubusercontent.com/brettz9/enumerate/master/screenshots/omnibox-search-terms.png)

![Omnibox selected](https://raw.githubusercontent.com/brettz9/enumerate/master/screenshots/omnibox-selected.png)

## Instructions

1. Type `g` and a space to activate Enumerate.
2. Type your search terms.
3. Use the arrows or mouse to select one of the search results to go directly to that page.

## Credits

- Inspired by the work of the Firefox add-on [CyberSearch](http://cybersear.ch/)

## Possible to-dos

1. Populate results based on Mediawiki API (where headers could advertise
    Mediawiki support?)
1. Make another extension based on this which uses `activeTab` permission and a
    different omnibox keyword to do a search of current site
