# ZynAddSubFX-WebApp

Mobile web UI for switching ZynAddSubFX instruments on a Raspberry Pi via OSC.

Documentation: [lucidbeaming.com/art/code/zynaddsubfx-webapp](https://lucidbeaming.com/art/code/zynaddsubfx-webapp)

**Build write-up:** [Setting up a Raspberry Pi 3 to run ZynAddSubFX in a headless configuration](https://lucidbeaming.com/blog/setting-up-a-raspberry-pi-3-to-run-zynaddsubfx-in-a-headless-configuration/)

A headless [ZynAddSubFX](https://zynaddsubfx.sourceforge.io/) synth has no screen, so there's no way to pick a sound while playing. This small Node.js app runs on the same Raspberry Pi and serves a phone-sized list of instruments. Tap one and the synth switches to it. It's part of a battery-powered synth box played from a USB MIDI keyboard; the setup scripts are in [pi-synths](https://github.com/lucidbeaming/pi-synths).

## Requirements

- Node.js 20 or newer (on Raspberry Pi OS trixie, `sudo apt install nodejs npm` is new enough)
- ZynAddSubFX running **on the same machine** with OSC enabled on port 7777 (`zynaddsubfx -P 7777 …`). The [`zynlaunch.sh`](https://github.com/lucidbeaming/pi-synths/blob/master/ZynAddSubFX/zynlaunch.sh) script in pi-synths starts it that way.
- ZynAddSubFX's instrument banks, found automatically in `/usr/share/zynaddsubfx/banks` (the Raspberry Pi OS / Debian package) or `/usr/local/share/zynaddsubfx/banks` (a source build)

## Install

```bash
git clone https://github.com/lucidbeaming/ZynAddSubFX-WebApp.git
cd ZynAddSubFX-WebApp
npm ci
npm start
```

Then open `http://<address of the Pi>:7000` on a phone (or any browser) on the same network.

## Configuration

| Setting | Where | Default | Notes |
|---|---|---|---|
| Web port | `PORT` environment variable | `7000` | macOS uses 7000 for AirPlay Receiver, so use another port there, e.g. `PORT=7001 npm start` |
| Instrument banks | `BANKS` environment variable | `/usr/share/zynaddsubfx/banks` or `/usr/local/share/zynaddsubfx/banks`, whichever exists | The folder in use is logged at startup |
| OSC | `index.js` | sends from `127.0.0.1:6666` to `127.0.0.1:7777` | Must match ZynAddSubFX's `-P` port |

## Usage

- **Tap an instrument** to load it into part 1, which plays on MIDI channel 1.
- **silence** sends ZynAddSubFX's panic command, stopping every sounding note.

### Changing the instrument list

The list is in [`index.html`](index.html). Each entry is a button whose `data-path` is the instrument file relative to the banks folder:

```html
<li><button type="button" aria-pressed="false" data-path="Collection/0032-Slow Saw.xiz">slosaw</button></li>
```

Copy a line, change `data-path` to any `.xiz` file under the banks folder and the label to whatever you want shown. Paths outside the banks folder are rejected by the server.

### Starting at boot

The [blog post](https://lucidbeaming.com/blog/setting-up-a-raspberry-pi-3-to-run-zynaddsubfx-in-a-headless-configuration/) starts the app from the `pi` user's `~/.profile`. On a current Raspberry Pi OS, a systemd service is the cleaner way:

```ini
# /etc/systemd/system/zynweb.service
[Unit]
Description=ZynAddSubFX web app
After=network-online.target

[Service]
User=pi
WorkingDirectory=/home/pi/ZynAddSubFX-WebApp
ExecStart=/usr/bin/npm start
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now zynweb
```

Adjust `User`, the paths and the `npm` location (`which npm`) to your install.

## How it works

1. [`index.js`](index.js) serves `index.html` and its assets with Express, and listens for socket.io messages.
2. The page sends the tapped instrument's path, or `silence`.
3. The server checks the path stays inside the banks folder and ends in `.xiz`. Then it sends ZynAddSubFX the OSC message `/load_xiz <part> <full path>` (or `/Panic`) over UDP with the [osc](https://www.npmjs.com/package/osc) package.

## Related projects

- [pi-synths](https://github.com/lucidbeaming/pi-synths): the scripts that set up and launch ZynAddSubFX on the Pi
- [Fluidsynth-Webapp](https://github.com/lucidbeaming/Fluidsynth-Webapp): the same idea for FluidSynth and SoundFonts
- [Camel](https://github.com/lucidbeaming/Camel): an Arduino drone synth

## License

[MIT](LICENSE).
