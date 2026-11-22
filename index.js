// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
const { Server } = require('socket.io');
const io = new Server(server);
var osc = require("osc");
var path = require('path');

// ZynAddSubFX instrument banks (where a source build installs them)
var BANKS = '/usr/local/share/zynaddsubfx/banks';

app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

// HTTP port for the web app. macOS uses 7000 for AirPlay Receiver, so set
// PORT (e.g. 7001) when running on a Mac.
var PORT = Number(process.env.PORT) || 7000;
server.listen(PORT, function () {
    console.log('ZynAddSubFX web app on port ' + PORT);
});

var udpPort = new osc.UDPPort({
    localAddress: "127.0.0.1",
    localPort: 6666,

    remoteAddress: "127.0.0.1",
    remotePort: 7777,
    metadata: true
});

// Without a listener, a UDP error (e.g. the port already in use) would crash
// the server instead of being logged.
udpPort.on('error', function (err) {
    console.error('OSC: ' + err.message);
});

udpPort.open();

// Turn a bank-relative path from the browser ("Pads/0001-Sine Pad.xiz") into a
// full path, or null if it isn't a .xiz file inside BANKS. Rejects absolute
// paths, ".." escapes and control characters.
function bankFile(rel) {
    if (typeof rel !== 'string' || /[\x00-\x1f]/.test(rel) || path.isAbsolute(rel)) {
        return null;
    }
    var full = path.resolve(BANKS, rel);
    if (!full.startsWith(BANKS + path.sep) || path.extname(full) !== '.xiz') {
        return null;
    }
    return full;
}

function changeinst(fullpath) {
    var msg = {
        address: '/load_xiz',
        args: [
            {
                type: 'i',
                value: 0
            },
            {
                type: 's',
                value: fullpath
            }
        ]
    };

    console.log("osc: ", msg.address, msg.args);
    udpPort.send(msg);
}

function appinit() {
    var fullpath = bankFile("Pads/0001-Sine Pad.xiz");
    var msg = {
        address: '/load_xiz',
        args: [
            {
                type: 'i',
                value: 1
            },
            {
                type: 's',
                value: fullpath
            }
        ]
    };

    console.log("osc: ", msg.address, msg.args);
    udpPort.send(msg);

    var fullpath = bankFile("Drums/0001-Drums Kit1.xiz");
    var msg = {
        address: '/load_xiz',
        args: [
            {
                type: 'i',
                value: 9
            },
            {
                type: 's',
                value: fullpath
            }
        ]
    };

    console.log("osc: ", msg.address, msg.args);
    udpPort.send(msg);
}

function panic() {
    var msg = {
        address: '/Panic',
        args: []
    };

    console.log("osc: ", msg.address, msg.args);
    udpPort.send(msg);
}

io.on('connection', function(client) {
    console.log('server connected');
    appinit();
    client.on('msg', function(data) {
        if (data == 'silence') {
		panic();
		console.log('PANIC');
	} else if (typeof data === 'string' && data.slice(-3) == 'xiz') {
		var file = bankFile(data);
		if (file) {
			changeinst(file);
			console.log('INST');
		} else {
			console.error('rejected instrument path: ' + JSON.stringify(data));
		}
	} else {
		console.log(data);
	}
    });
});
