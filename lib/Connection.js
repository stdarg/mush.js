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
    this.loginTime = new Date();

	var self = this;

	this.socket.on('end', function() {
		//global.SpaceMud.connectionDisconnected(self);
	});

	this.socket.on('data', function(data) {
		global.SpaceMud.handleInput(self, data)
	});

	this.socket.on('close', function(data) {
		global.SpaceMud.connectionDisconnected(self, data)
	});

	this.socket.on('error', function(data) {
		global.SpaceMud.connectionDisconnected(self, data)
	});

    // FIXME: handle 'timeout', 'drain'
};

Connection.prototype.timeOnlineSecs = function() {
    var now = new Date();
    var diff = now - this.loginTime;
    return Math.floor(diff/1000.0);
};

exports.Connection = Connection;
