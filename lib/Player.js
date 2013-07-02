/**
 * @fileOver This file defines the Player object which describes an individual player.
 */

'use strict';

exports.Player = Player;

var counter = 0;

function Player(socket) {
    this.connected = false;
    this.data = {};
    this.data.loc = -1;
    this.name = 'Guest_' + counter++;
}

// create getters and setters for data properties
Object.defineProperty(Player.prototype, "loc", {
    get: function() { return this.data.loc; },
    set: function(l) { this.data.loc = l; return this; }
});

Object.defineProperty(Player.prototype, "name", {
    get: function() { return this.data.name; },
    set: function(n) { this.data.name = n; return this; }
});

Object.defineProperty(Player.prototype, "sex", {
    get: function() { return this.data.sex; },
    set: function(s) { this.data.sex = s; return this; }
});

Object.defineProperty(Player.prototype, "desc", {
    get: function() { return this.data.desc; },
    set: function(d) { this.data.desc = d; return this; }
});

Object.defineProperty(Player.prototype, "owner", {
    get: function() { return this.data.owner; },
    set: function(o) { this.data.owner = o; return this; }
});

Object.defineProperty(Player.prototype, "id", {
    get: function() { return this.data.id; },
    set: function(i) { this.data.owner = i; return this; }
});

Player.prototype.isConnected = function() {
    return this.connected;
};

Player.prototype.isDisconnected = function() {
    return this.connected === false;
};

Player.prototype.updateWithDbObj = function(dbObj) {

    if (!dbObj) {
        log.error('Player.updateWithDbObj: received a null argument for dbObj.');
        return;
    }

    assert.ok(dbObj.name && dbObj.name.length);
    this.name = dbObj.name;
    this.data = dbObj;
};
