/**
 * @fileOver This file defines the Player object which describes an individual player.
 */

var util = require('util');
var counter = 0;

Player = function(server, socket) {
	this.server = server;
	this.socket = socket;
	this.attribs = {};
	this.id = counter;
	this.name = 'Player_' + counter;
	counter++;
};

exports.Player = Player;
