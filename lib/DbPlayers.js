'use strict';

var assert = require('assert');
var util = require('util');
var Collection = require('./Db').Collection;
exports.PlayerCollection = PlayerCollection;

function PlayerCollection(cb) {
    var self = this;
    PlayerCollection.super_.call(this, 'players', function(err, collection) {
        self.isEmpty(function(err, empty) {
            if (!empty) {
                cb(err, self);
                return;
            }

            // create god
            self.createPlayer('God', createHash('potrzebie'), function(err, god) {
                if (err) {
                    cb(err, self);
                    return;
                }
                console.log('Created God #'+god.id);
                assert.ok(god.id === 1);
                cb(err, self);
                return;
            });
        });
    });
}

util.inherits(PlayerCollection, Collection);

PlayerCollection.prototype.createPlayer = function(playerName, hash, cb) {
    if (typeof playerName === "undefined" || playerName.length === 0) {
        cb('The argument \'playerName\' was undefined or an empty string.');
        return;
    }

    if (typeof hash === "undefined" || hash.length === 0) {
        cb('The argument \'hash\' was undefined or an empty string.');
        return;
    }

    var player = {};                // create new player obj
    player.name = playerName;       // add default data
    player.cdate = new Date();
    player.hash = hash;
    player.sex = 'n';
    player.last = player.cdate;
    player.desc = 'You see a person with many possibilities.';
    player.id = mush.data.getNextId();
    player.owner = player.id;
    player.loc = 0;

    this.dbCollection.insert(player, function(err, newPlayer) {
        if (err) {
            console.error('Error: '+err);
            return;
        }
        if (Object.prototype.toString.call(newPlayer) === '[object Array]')
            newPlayer = newPlayer[0];
        cb(null, newPlayer);
        // FIXME add id and set owner to that id
    });
};

function createHash(strIn) {
    var crypto = require('crypto');
    var hmac = crypto.createHmac('sha1', 'potrzebie');
    hmac.update(strIn);
    var hash = hmac.digest('base64');
    return hash;
}
