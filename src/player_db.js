/**
 * @fileOverview Herein lies the PlayerDb, a class derived from Db that manages
 * db access for player data.
 */
'use strict';
var Db = require('./db').Db;
exports.PlayerDb = PlayerDb;
util.inherits(PlayerDb, Db);

/**
 * The player Db object manages accesses to and from the db for player data.
 * @param {function} cb A callback that returns the player Db object once it is
 * ready for use.
 */
function PlayerDb(cb) {
    assert.ok(is.func(cb));

    var self = this;
    PlayerDb.super_.call(self, 'players', function(err) {
        if (err) {
            log.error('PlayerDb constructor: %j', err);
            return cb(err);
        }
        self.isEmpty(function(err, empty) {
            if (!empty)
                return cb(err, self);

            // create god
            self.createPlayer('God', mush_utils.createHash('potrzebie'), function(err, god) {
                if (err)
                    return cb(err, self);

                assert.ok(is.obj(god));
                assert.ok(is.int(god.id));
                assert.ok(god.id === 1);
                return cb(err, self);
            });
        });
    });
}

/**
 * createPlayer does pretty much what you'd expect, creates a player in the db.
 * @param {string} playerName The name of the player to be created.
 * @param {string} hash A hash for authentication of the player.
 * @param {function} cb A callback that returns an error as the first arg or
 * the newly created player as the second arg.
 */
PlayerDb.prototype.createPlayer = function(playerName, hash, cb) {
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
    // FIXME: Have a definition of where the start room is.
    player.loc = 0;

    this.dbCollection.insert(player, function(err, newPlayer) {
        if (err) {
            log.error('PlayerDb.createPlayer: insert error: '+JSON.stringify(err));
            return;
        }

        assert.ok(is.nonEmptyArray(newPlayer));
        assert.ok(newPlayer.length === 1);
        newPlayer = newPlayer[0];
        log.info('Created player: %s(#%d)\n%j', player.name, player.id, newPlayer);
        cb(null, newPlayer);
    });
};

/**
 * Updates player data in the db.
 * @param {object} playerData An object conatining the player data to be updated in the db.
 * @param {function} cb A callback that either returns an error or the updated player object.
 */
//PlayerDb.prototype.updatePlayer = function(playerData, cb) {
//};
