/**
 * This is where the definition of the ObjectCollection object is. It's purpose is to manage game objects
 * in the database, with the exception of the Players, which have their own collection.
 */

'use strict';

var assert = require('assert');
var util = require('util');
var Collection = require('./Collection').Collection;
var is = require('is2');

exports.ObjectCollection = ObjectCollection;
util.inherits(ObjectCollection, Collection);

/**
 * Manages the DB interactions of saving, updating and removing data in the database.
 * @constructor
 * @param {function} cb A callback to execute when the collection is ready for use.
 */
function ObjectCollection(cb) {
    assert.ok(is.func(cb));

    var self = this;
    ObjectCollection.super_.call(this, 'objects', function(err, collection) {
        if (err) {
            cb('There was an error setting up the object collection: '+err);
            return;
        }

        assert.ok(is.obj(collection));

        self.isEmpty(function(err, empty) {

            if (err) {
                cb('There was an error with isEmpty: '+JSON.stringify(err));
                return;
            }

            if (empty === false) {
                cb(undefined, this);
                return; // we're done
            }

            assert.ok(is.obj(global.mush));
            assert.ok(is.obj(global.mush.data));

            // empty db, create #0
            var room = {};
            room.id = global.mush.data.getNextId();
            console.log('room id: '+room.id);
            assert.ok(is.int(room.id));
            assert.ok(room.id === 1);
            room.name = 'The Void';
            room.type = 'r';
            room.desc = 'You stand at the precipice of creation at an '+
                        'intersection of countless possibilities.';
            room.loc = 0;

            self.insert(room, function(err, room) {
                if (err) {
                    return cb('There was an error creating the first room: '+JSON.stringify(err));
                }
                console.log('Created The Void #'+room.id);
                cb(undefined, self);
            });
        });
    });
}
