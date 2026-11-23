# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed
- socket.io 2.x → 4.x. The page connects with `io()` to whichever host served it, instead of the hard-coded `http://zyn.local:7000` (#3)
- express 4 → 5 and osc 2.2 → 2.4; `engines.node` is `>=20` (#3)
- `package-lock.json` is committed, and `node_modules` is git-ignored (#3)

### Added
- MIT license (#6)
- Package metadata: `repository`, `bugs` and `homepage` in `package.json` (#6)
- `npm start` (#3)
- `PORT` setting for the web app (default 7000; macOS uses 7000 for AirPlay Receiver) (#3)

### Fixed
- Instrument paths from the browser are checked to stay inside the bank folder. Previously `../` or absolute paths could point ZynAddSubFX at any `.xiz` file (#4)
- A non-string message, or a UDP error, no longer crashes the server (#3, #4)

### Security
- osc's pinned `ws` 8.18.0 is overridden to a patched 8.x (#3)

### Removed
- Serving `node_modules` over HTTP (#3)
