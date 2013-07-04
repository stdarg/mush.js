/**
 * @fileOverview This file defines the Player object which describes an individual player.
 * Any logic or data specific to players goes here.
 */

'use strict';

exports.Player = Player;
var Obj = require('./Object').Obj;
util.inherits(Player, Obj);

var counter = 0;        // a counter to give Guests unique names

/**
 * Creates a Player object.
 * @constructor
 */
function Player() {
    Player.super_.call(this);
    this.connected = false;
    this.name = 'Guest_' + counter++;
}

/**
 * FIXME: replace with flags
 */
Player.prototype.isConnected = function() {
    return this.connected;
};

/**
 * FIXME: replace with flags
 */
Player.prototype.isDisconnected = function() {
    return this.connected === false;
};

/**
 * LAST - date of last login
 */
Object.defineProperty(Obj.prototype, "LAST", {
    get: function() { return this.data.LAST; },
    set: function(l) { this.data.LAST = l; return this; }
});

/**
 * LASTSITE - dns name of the last host from 
 */
Object.defineProperty(Obj.prototype, "LASTSITE", {
    get: function() { return this.data.LASTSITE; },
    set: function(l) { this.data.LASTSITE = l; return this; }
});

/**
 * LASTIP - the IP address of the site the player logged in from
 */
Object.defineProperty(Obj.prototype, "LASTIP", {
    get: function() { return this.data.LASTIP; },
    set: function(l) { this.data.LASTIP = l; return this; }
});

/**
 * FIRST - date of the first login for the player
 */
Object.defineProperty(Obj.prototype, "FIRST", {
    get: function() { return this.data.FIRST; },
    set: function(f) { this.data.FIRST = f; return this; }
});

/**
 * FIRSTSITE - the dns name of the site from where teh player
 * logged in from
 */
Object.defineProperty(Obj.prototype, "FIRSTSITE", {
    get: function() { return this.data.FIRSTSITE; },
    set: function(f) { this.data.FIRSTSITE = f; return this; }
});
