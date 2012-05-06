/**
 * @fileOver This file defines the Player object which describes an individual player.
 */

'use strict';
var assert = require('assert');
var util = require('util');
var counter = 0;

function Player(server, socket) {
	this.server = server;
	this.socket = socket;
	this.attribs = {};
	this.id = counter;
	this.name = 'Guest_' + counter;
	counter++;
}

Player.prototype.updateWithDbObj = function(dbObj) {

    if (!dbObj) {
        console.error('Player.updateWithDbObj: received a null argument for dbObj.');
        return;
    }

    assert.ok(dbObj.name && dbObj.name.length);
    this.name = dbObj.name;
    this.data = dbObj;
};

exports.Player = Player;