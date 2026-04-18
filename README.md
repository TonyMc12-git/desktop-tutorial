# Nine Letters

A browser word game built around a fixed British-English source list.

## Rules

- The board shows nine distinct letters.
- Every accepted word must be at least four letters long.
- Every accepted word must include the central gold letter.
- A letter cannot be used more times than it appears on the board.
- Only accepted words are shown in the history list.
- Milestones unlock at 25, 50, 75, and 100 percent of the puzzle total.

## Source

The accepted-word source files are:

- `data/scowl-british-oxford-size35-common-forms.txt`
- `data/scowl-british-oxford-size50-common-forms.txt`

The app currently uses the size `50` version. In [game.js](c:/Users/antho/OneDrive/Documents/vibe_coding/project_1/game.js), change `dictionaryTier` from `"50"` to `"35"` if you want to switch back quickly.

These files are derived from the free SCOWL English Speller Database using British Oxford spelling (`-ize`) as the base. The current filtering policy is:

- SCOWL size `35` or `50`
- spelling codes `_` and `Z`
- variant level `<= 1`
- common standard forms included
- changed plurals like `spies` are allowed
- explicit verb forms like `pours` are allowed
- common `-e + s` forms like `bites` are allowed
- simple bare `+s` forms are excluded only when they are noun-plural-only at this source level
- example: `doors` excluded, but `tails` and `flops` allowed
- lowercase alphabetic words only
- exclude abbreviations
- exclude proper names and town/place entries
- exclude acronym and all-uppercase tagged entries
- exclude hacker/programmer jargon and Roman numerals
- exclude colloquial, informal, nonstandard, offensive, and vulgar entries
- exclude hyphenated, apostrophized, accented, and non-alpha forms from the shipped game list

This is not the Oxford Dictionary. It is a fixed free British-English source list chosen because it is shippable and reproducible.

## Use it on a phone

Nine Letters is a static PWA. It does not need your laptop to be running once it is deployed to a web host.

This repo includes a GitHub Pages workflow at `.github/workflows/deploy-pages.yml`. When changes are pushed to `main`, GitHub Pages can publish the app at:

- `https://tonymc12-git.github.io/desktop-tutorial/`

Once the page opens on your phone:

- on iPhone: use Safari and tap `Share > Add to Home Screen`
- on Android: use Chrome and tap `Add to Home Screen` or `Install app`

After the first successful load, the service worker caches the app shell and word list so it can continue to run like an installed app.

## Local testing

The local launch scripts are only for development on this machine. They start a tiny HTTP server because browsers block `fetch()` from directly reading local files opened with `file://`.

For local testing on Windows, double-click `play-game.vbs`, which opens:

- `http://localhost:8000/index.html`

To test from a phone on the same Wi-Fi before deploying, run:

- `Play Nine Letters On Phone.bat`

That laptop-hosted URL is a preview tool, not the production way to share or install the game.

## Current puzzle

The shipped puzzle uses the letters in `PROFUSELY`. Its valid words are computed at runtime from the fixed SCOWL-based source file, not from a hand-maintained list.
