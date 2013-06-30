/**
 * This is where the definition of the ObjectDb object is. It's purpose is to manage
 * game objects in the database, with the exception of the Players, which have their own
 * Db.
 */

'use strict';
var Db = require('./Db').Db;

exports.ObjectDb = ObjectDb;
util.inherits(ObjectDb, Db);

/**
 * Manages the DB interactions of saving, updating and removing data in the database.
 * @constructor
 * @param {function} cb A callback to execute when the Db is ready for use.
 */
function ObjectDb(cb) {
    assert.ok(is.func(cb));

    var self = this;
    ObjectDb.super_.call(this, 'objects', function(err, Db) {

        if (err)
            return cb('There was an error setting up the object Db: '+err);

        assert.ok(is.obj(Db));

        self.isEmpty(function(err, empty) {

            if (err)
                return cb('ObjectDb: There was an error with isEmpty: '+JSON.stringify(err));

            if (empty === false)
                return cb(undefined, this);

            assert.ok(is.obj(global.mush));
            assert.ok(is.obj(global.mush.data));

            // empty db, create #0
            var room = {};
            room.id = global.mush.data.getNextId();
            log.info('room id: '+room.id);
            assert.ok(is.int(room.id));
            assert.ok(room.id === 0);
            room.name = 'The Void';
            room.type = 'r';
            room.desc = 'You stand at the precipice of creation at an '+
                        'intersection of countless possibilities.';
            room.loc = 0;

            self.insert(room, function(err, room) {
                if (err) {
                    return cb('There was an error creating the first room: '+JSON.stringify(err));
                }
                log.info('Created The Void #%d',room.id);
                return cb(undefined, self);
            });
        });
    });
}
