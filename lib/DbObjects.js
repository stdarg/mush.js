'use strict';

var assert = require('assert');
var util = require('util');
var Collection = require('./Db').Collection;
exports.ObjectCollection = ObjectCollection;

function ObjectCollection(cb) {
    var self = this;
    ObjectCollection.super_.call(this, 'objects', function(err, collection) {
        if (err) {
            cb('There was an error setting up the object collection.');
            return;
        }

        if (self.isEmpty() === false) {
            cb(null, this);
            return; // we're done
        }
    
        assert.ok(global.mush);
        assert.ok(global.mush.data);
    
        // empty db, create #0
        var room = {};
        room.id = global.mush.data.getNextId();
        room.name = 'The Void';
        room.type = 'r';
        room.desc = 'You stand at the precipice of creation.';
        self.insert(room, function(err, room) {
            if (err) {
                cb('There was an error creating the first room.');
                return;
            }
            cb(null, self);
        });
    });
}

util.inherits(ObjectCollection, Collection);
