/*!
 * This file defines the Connection class which is a socket connection for a single player. The
 * connection object also conatains the Player object.
 */
'use strict';

var assert = require('assert');
var is = require('is2');
var Player = require('./player').Player;

exports.Connection = Connection;

/**
 * Connection in the object that holds the socket and the Player objects.
 * It is constructed in the Server object in the callback in net.createServer
 * when new player connections occur.
 * @constructor
 * @param {object} socket A node.js net.Socket object.
 * @param {number} id The id of the player logging in. Players when they first connect are given
 *      a connection id, which is a counter of all the connections.
 */
function Connection(socket, id) {
    assert.ok(is.object(socket));
    assert.ok(is.int(id));

    this.socket = socket;
    this.connectionId = id;
    this.player = new Player(socket);
    this.loginTime = new Date();

    var self = this;

    this.socket.on('end', function() {
        global.mush.Server.connectionDisconnected(self);
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

/**
 * Returns the time online in seconds for this connected player.
 * @public
 * @returns {number} The time spent online in seconds.
 */
Connection.prototype.timeOnlineSecs = function() {
    var now = new Date();
    var diff = now - this.loginTime;
    return Math.floor(diff/1000.0);
};
