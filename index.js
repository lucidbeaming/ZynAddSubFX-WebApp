// app.js
var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
const { Server } = require('socket.io');
const io = new Server(server);
var osc = require("osc");

app.use(express.static(__dirname + '/node_modules'));  
app.use(express.static(__dirname + '/assets'));

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

server.listen(7000);

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

function changeinst(path) {
    var fullpath="/usr/local/share/zynaddsubfx/banks/" + path;
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
    var path = "Pads/0001-Sine Pad.xiz"
    var fullpath="/usr/local/share/zynaddsubfx/banks/" + path;
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

    var path = "Drums/0001-Drums Kit1.xiz"
    var fullpath="/usr/local/share/zynaddsubfx/banks/" + path;
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
	} else if (data.slice(-3) == 'xiz') {
		changeinst(data);
		console.log('INST');
	} else {
		console.log(data);
	}
    });
});
