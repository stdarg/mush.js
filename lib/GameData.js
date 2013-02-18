/**
 * GameDataCollection is a 
 */

'use strict';

var assert = require('assert');
var util = require('util');
var Collection = require('./Collection').Collection;
var is = require('is2');

exports.GameDataCollection = GameDataCollection;

function GameDataCollection(cb) {
    assert.ok(global.mush);
    assert.ok(is.func(cb));

    var self = this;

    GameDataCollection.super_.call(this, 'mush_data', function(err, collection) {
        if (err) {
            cb(err);
            return;
        }
        self.isEmpty(function(err, empty) {
            if (err) {
                cb('There was an error in isEmpty: '+err);
                return;
            }

            assert.ok(is.bool(empty));

            if (!empty) {
                console.log('GameData collection is NOT empty.');
                self.findAll(function(err, dataArray) {
                    assert.ok(!err);
                    assert.ok(is.nonEmptyArray(dataArray));
                    self._data = dataArray[0];
                    console.log('self._data: '+util.inspect(self._data));
                    assert.ok(self._data);
                    assert.ok(self._data.freeList);
                    assert.ok(is.array(self._data.freeList));
                    assert.ok(is.int(self._data.nextId));
                    assert.ok(self._data.nextId >= 0);
                    cb(undefined, self);
                });
                return;
            } else {
                console.log('GameData collection IS empty.');
                self._data = {};
                self._data.freeList = [];
                self._data.nextId = 0;
                self.insert(self._data, function(err, obj) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    assert.ok(is.obj(obj));
                    cb(null, self);
                });
            }
        });
    });
};


util.inherits(GameDataCollection, Collection);

GameDataCollection.prototype.freeListNotEmpty = function() {
    assert.ok(is.obj(this._data));
    assert.ok(is.array(this._data.freeList));

    if (this._data.freeList.length > 0)
        return true;
    return false;
};

GameDataCollection.prototype.popFreeList = function() {
    assert.ok(this._data);
    assert.ok(is.nonEmptyArray(this._data.freeList));

    var id = this._data.freeList.pop();
    this.update(this._data, function(err, data) {
        if (err)
            console.error('There was an error updating the game data collection: '+err);
    });
    return id;
};

GameDataCollection.prototype.pushFreeList = function(id) {
    assert.ok(is.int(id));
    assert.ok(is.obj(this._data));
    assert.ok(is.array(this._data.freeList));

    var id = this._data.freeList.push(id);
    this.update(this._data, function(err, data) {
        if (err)
            console.error('There was an error updating the game data collection: '+err);
    });
};

GameDataCollection.prototype.getNextId = function() {
    console.log('GameDataCollection.prototype.getNextId: '+util.inspect(this._data));
    assert.ok(is.obj(this._data));
    assert.ok(is.int(this._data.nextId));
    assert.ok(this._data.nextId >= 0);
    assert.ok(is.array(this._data.freeList));

    var id;

    if (this._data.freeList.length > 0)
        id =  this.popFreeList();
    else
        id = this._data.nextId++;

    this.update(this._data, null, function(err, data) {
        if (err)
            console.error('There was an error updating the game data collection: '+err);
    });
    return id;
};
