'use strict';

var util = require('util');
var Collection = require('./Db').Collection;
exports.PlayerCollection = PlayerCollection;

function PlayerCollection(cb) {
    var self = this;
    PlayerCollection.super_.call(this, 'players', function(err, collection) {
        cb(err, self);
    });
}

util.inherits(PlayerCollection, Collection);

PlayerCollection.prototype.createPlayer = function(playerName, password, cb) {
    if (typeof playerName === "undefined" || playerName.length === 0) {
        cb('The argument \'playerName\' was undefined or an empty string.');
        return;
    }

    if (typeof password === "undefined" || password.length === 0) {
        cb('The argument \'password\' was undefined or an empty string.');
        return;
    }

    var player = {};                // create new player obj
    player.name = playerName;       // add default data
    player.cdate = new Date();
    player.pass = password;
    player.sex = 'n';
    player.last = player.cdate;
    player.desc = 'You see a person with many possibilities.';
    player.id = mush.data.getNextId();
    player.owner = player.id;

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
