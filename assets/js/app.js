// Sends instrument changes to the server over socket.io; the server turns
// them into OSC messages for ZynAddSubFX. Connects back to whichever host
// served the page (any hostname or IP, HTTPS too).
var socket = io();
var statusLine = document.getElementById('status');
var list = document.getElementById('instruments');

list.addEventListener('click', function (e) {
	var button = e.target.closest('button[data-path]');
	if (!button) return;
	socket.emit('msg', button.dataset.path);
	list.querySelectorAll('button[aria-pressed="true"]').forEach(function (b) {
		b.setAttribute('aria-pressed', 'false');
	});
	button.setAttribute('aria-pressed', 'true');
});

document.getElementById('panic').addEventListener('click', function () {
	socket.emit('msg', 'silence');
});

socket.on('connect', function () {
	statusLine.textContent = '';
	socket.emit('msg', 'client connected');
});
socket.on('disconnect', function () {
	statusLine.textContent = 'Disconnected from the Pi. Reconnecting…';
});
