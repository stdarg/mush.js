/**
 * @fileOverview This filr defines the Connection class which
 * is a socket connection for a single player.
 */
var Player = require('./player').Player;
var util = require('util');
var Server = require('./Server').Server;

Connection = function(socket, id) {
	this.socket = socket;
	this.connectionId = id;
	this.player = new Player(socket);

	var self = this;

	this.socket.on('end', function() {
		global.SpaceMud.connectionDisconnected(self);
	});

	this.socket.on('data', function(data) {
		global.SpaceMud.handleInput(self, data)
	});

    // FIXME: handle 'end', 'timeout', 'drain', 'error' and 'close'
};

exports.Connection = Connection;
