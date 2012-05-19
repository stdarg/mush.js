'use strict';

var assert = require('assert');
var util = require('util');

var Collection = require('./Db').Collection;
var is = require('./is');

exports.PlayerCollection = PlayerCollection;

function PlayerCollection(cb) {
    assert.ok(is.func(cb));

    var self = this;
    PlayerCollection.super_.call(self, 'players', function(err, collection) {
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
                assert.ok(is.obj(god));
                assert.ok(is.int(god.id));
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
    assert.ok(is.nonEmptyStr(playerName));
    assert.ok(is.nonEmptyStr(hash));
    assert.ok(is.func(cb));

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

        assert.ok(is.nonEmptyArray(newPlayer));
        assert.ok(newPlayer.length === 1);
        newPlayer = newPlayer[0];
        cb(null, newPlayer);
    });
};

function createHash(strIn) {
    assert.ok(is.nonEmptryStr(strIn));
    var crypto = require('crypto');
    var hmac = crypto.createHmac('sha1', 'potrzebie');
    hmac.update(strIn);
    var hash = hmac.digest('base64');
    assert.ok(is.nonEmptryStr(hash));
    return hash;
}
