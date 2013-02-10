/**
 * @fileOverview This file defines the Connection class which
 * is a socket connection for a single player.
 */
'use strict';

var assert = require('assert');
var is = require('./is');
var Player = require('./Player').Player;

function Connection(socket, id) {
    assert.ok(is.object(socket));
    assert.ok(is.int(id));

	this.socket = socket;
	this.connectionId = id;
	this.player = new Player(socket);
    this.loginTime = new Date();

	var self = this;

	this.socket.on('end', function() {
		//global.mush.connectionDisconnected(self);
	});

	this.socket.on('data', function(data) {
		global.mush.Server.handleInput(self, data);
	});

	this.socket.on('close', function(data) {
		global.mush.Server.connectionDisconnected(self, data);
	});

	this.socket.on('error', function(data) {
		global.mush.Server.connectionDisconnected(self, data);
	});

    // FIXME: handle 'timeout', 'drain'
}

Connection.prototype.timeOnlineSecs = function() {
    var now = new Date();
    var diff = now - this.loginTime;
    return Math.floor(diff/1000.0);
};

exports.Connection = Connection;
