# ZynAddSubFX-WebApp
Node.js web app to change instruments in ZynAddSubFX on a Raspberry Pi.

This app displays a list of predefined instruments in ZynAddSubFX, displayed as a mobile optimized web page using jQuery Mobile, express, and socket.io. The commands to change the instruments are sent as OSC messages.

It is intended to run on a Raspberry Pi 3 with Raspbian Jessie Lite (Debian 8).

Node.js 6.10.1 is required:
```
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | sh
```
logout and log back in to use NVM
```
nvm install v6.10.1
```

# Installation

clone the repo in the user directory
```
cd ZynAddSubFX-WebApp
npm install
```

# Use

It's useful to include this app in the launch script for ZynAddSubFX...

Launch ZynAddSubFX
```
cd ZynAddSubFX-WebApp
node index.js
```
On another device/browser on the same network, go to 
`http://<IP address of the Raspberry Pi>:7000`



