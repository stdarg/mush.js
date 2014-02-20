/**
 * @fileOverview This file defines the Player object which describes an individual player.
 * Any logic or data specific to players goes here.
 */

'use strict';

module.exports = Player;
var Obj = require('./object');
util.inherits(Player, Obj);

var counter = 0;        // a counter to give Guests unique names

/**
 * Creates a Player object.
 * @constructor
 */
function Player(dbObj) {
    var self = this;
    Obj.call(self, 'p');        // call base class constructor

    if (dbObj) {
        self.loadFromDb(dbObj);
    } else {
        // we don't use self.name to avoid db writes.
        self.data.name = 'Guest_' + counter++;
    }
    global.mush.PlayerDir.add(self);
}

Player.prototype.isConnected = function() {
    return this.getFlag('connected');
};

Player.prototype.isDisconnected = function() {
    return this.getFlag('connected') === false;
};

/**
 * LAST - date of last login
 */
Object.defineProperty(Obj.prototype, 'LAST', {
    get: function() { return this.data.LAST; },
    set: function(l) {
        assert.ok(is.positiveInt(l));
        this.data.LAST = l;
        this.saveToDb();
    }
});

/**
 * LASTSITE - dns name of the last host from 
 */
Object.defineProperty(Obj.prototype, 'LASTSITE', {
    get: function() { return this.data.LASTSITE; },
    set: function(l) {
        this.data.LASTSITE = l;
        this.saveToDb();
    }
});

/**
 * LASTIP - the IP address of the site the player logged in from
 */
Object.defineProperty(Obj.prototype, 'LASTIP', {
    get: function() { return this.data.LASTIP; },
    set: function(l) {
        assert.ok(is.nonEmptyStr(l));
        this.data.LASTIP = l;
        this.saveToDb();
    }
});

/**
 * FIRST - date of the first login for the player
 */
Object.defineProperty(Obj.prototype, 'FIRST', {
    get: function() { return this.data.FIRST; },
    set: function(f) {
        assert.ok(is.positiveInt(f));
        this.data.FIRST = f;
        this.saveToDb();
    }
});

/**
 * FIRSTSITE - the dns name of the site from where teh player
 * logged in from
 */
Object.defineProperty(Obj.prototype, 'FIRSTSITE', {
    get: function() { return this.data.FIRSTSITE; },
    set: function(f) {
        assert.ok(is.nonEmptyStr(f));
        this.data.FIRSTSITE = f;
        this.saveToDb();
    }
});
