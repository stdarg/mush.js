'use strict';

var assert = require('assert');
var util = require('util');

var Collection = require('./Db').Collection;
var is = require('./is');

exports.ObjectCollection = ObjectCollection;

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
                cb('There was an error with isEmpty.');
                return;
            }
    
            if (empty === false) {
                cb(null, this);
                return; // we're done
            }
        
            assert.ok(is.obj(global.mush));
            assert.ok(is.obj(global.mush.data));
    
            // empty db, create #0
            var room = {};
            room.id = global.mush.data.getNextId();
            assert.ok(is.int(room.id));
            assert.ok(room.id === 0);
            room.name = 'The Void';
            room.type = 'r';
            room.desc = 'You stand at the precipice of creation at an intersection of countless possibilities.';
            room.loc = 0;

            self.insert(room, function(err, room) {
                if (err) {
                    cb('There was an error creating the first room: '+err);
                    return;
                }
                console.log('Created The Void #'+room.id);
                cb(null, self);
            });
        });
    });
}

util.inherits(ObjectCollection, Collection);
