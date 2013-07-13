/**
 * @fileOverview This file defines the Player object which describes an individual player.
 * Any logic or data specific to players goes here.
 */

'use strict';

exports.Player = Player;
var Obj = require('./object').Obj;
util.inherits(Player, Obj);

var counter = 0;        // a counter to give Guests unique names

/**
 * Creates a Player object.
 * @constructor
 */
function Player() {
    Player.super_.call(this, 'p');
    this.name = 'Guest_' + counter++;
}

/**
 * login - log a player in
 * @param {Object} dbObj A db object with the player data.
 */
Player.prototype.login = function(dbObj, socket) {
    assert.ok(is.nonEmptyObj(dbObj));
    assert.ok(is.nonEmptyObj(socket));

    if (!dbObj.type)
        dbObj.type = 'p';

    log.warn('Player.login: %j', dbObj);

    this.loadFromDb(dbObj);
    this.setFlag('connected', true);

    this.data.LAST = Date.now();
    if (!this.data.FIRST)
        this.data.FIRST = Date.now();

    this.data.LASTIP = String(socket.remoteAddress);
    /*
    var dns = require('dns');
    dns.reverse(this.data.LAST, function(err, domains) {
        if (err) {
            log.error('Player.login dns.reverse: %j', err);
            return;
        }
        if (domains.length > 0) {
            this.data.LASTSITE = domains;
            this.saveToDb();
        }
    });
    */

    this.saveToDb();
};

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
