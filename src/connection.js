/**
 * @fileOverview
 * This file defines the Connection class which is a socket connection for a single player. The
 * connection object also conatains the Player object.
 */
'use strict';
var Player = require('./player');
exports.Connection = Connection;

/**
 * Connection in the object that holds the socket and the Player objects.
 * It is constructed in the Server object in the callback in net.createServer
 * when new player connections occur.
 * @constructor
 * @param {object} socket A node.js net.Socket object.
 * @param {number} id The id of the player logging in. Players when they first connect are given
 *   a connection id, which is a counter of all the connections.
 */
function Connection(socket, server, id) {
    assert.ok(is.object(socket));
    this.server = server;
    this.socket = socket;
    this.connectionId = id;
    this.player = null;
    log.error('this.player %s',inspect(this.player,{depth:null,colors:true}));
    this.loginTime = Date.now();
    this.setSocketEvents();
}

/**
 * setup handling for the socket events.
 * @param {Object} socket The socket received from the net server.
 */
Connection.prototype.setSocketEvents = function() {
    var self = this;

    this.socket.on('end', function() {
        self.server.connectionDisconnected(self);
    });

    this.socket.on('data', function(data) {
        self.server.handleInput(self, data);
    });

    this.socket.on('close', function(data) {
        self.server.connectionDisconnected(self, data);
    });

    this.socket.on('error', function(data) {
        self.server.connectionDisconnected(self, data);
    });
};

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

/**
 * login - log a player into the mush
 * @param {Object} dbObj A db object with the player data.
 */
Connection.prototype.login = function(player, socket) {
    var self = this;
    assert.ok(is.nonEmptyObj(player));
    assert.ok(is.nonEmptyObj(socket));
    var PlayerType = require('./player');
    assert.ok(player instanceof PlayerType);
    self.player = player;

    log.warn('Player.login: %j', player);
    player.setFlag('connected', true);

    self.player.data.LAST = Date.now();
    if (!self.player.data.FIRST)
        self.player.data.FIRST = Date.now();

    self.player.data.LASTIP = String(socket.remoteAddress);
    player.saveToDb();
};
