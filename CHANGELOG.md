# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [1.0.0] - 2026-11-23

The phone-friendly ZynAddSubFX instrument picker for a Raspberry Pi, working again. Tapping an instrument had done nothing since jQuery 3.5, and the packaged ZynAddSubFX's bank folder wasn't found. Now on socket.io 4 and Node 20+, written in plain JS, with instrument paths confined to the bank folder.

### Changed
- README rewritten for Node 20+: install with `npm ci`, configuration (`PORT`, the banks path for source or Debian installs), usage, editing the instrument list, starting at boot with systemd, and how it works (#10)
- socket.io 2.x → 4.x. The page connects with `io()` to whichever host served it, instead of the hard-coded `http://zyn.local:7000` (#3)
- express 4 → 5 and osc 2.2 → 2.4; `engines.node` is `>=20` (#3)
- `package-lock.json` is committed, and `node_modules` is git-ignored (#3)

### Added
- MIT license (#6)
- Package metadata: `repository`, `bugs` and `homepage` in `package.json` (#6)
- `npm start` (#3)
- `PORT` setting for the web app (default 7000; macOS uses 7000 for AirPlay Receiver) (#3)

### Fixed
- Instrument changes failed with the packaged ZynAddSubFX: the banks folder is now `/usr/share` or `/usr/local/share`, whichever exists, or `BANKS` (#15)
- Tapping an instrument or **silence** did nothing: jQuery 3.5 broke jQuery Mobile 1.4.5. The page is rewritten in plain JS with the same instruments (#8)
- Instrument paths from the browser are checked to stay inside the bank folder. Previously `../` or absolute paths could point ZynAddSubFX at any `.xiz` file (#4)
- A non-string message, or a UDP error, no longer crashes the server (#3, #4)

### Security
- osc's pinned `ws` 8.18.0 is overridden to a patched 8.x (#3)

### Removed
- Loading *Sine Pad* into part 2 and *Drums Kit1* into part 10 on every browser connection; only part 1 is used (#12)
- jQuery, jQuery Mobile and its icon set (#8)
- Serving `node_modules` over HTTP (#3)

[Unreleased]: https://github.com/lucidbeaming/ZynAddSubFX-WebApp/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/lucidbeaming/ZynAddSubFX-WebApp/releases/tag/v1.0.0
