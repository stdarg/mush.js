'use strict';

var assert = require('assert');
var util = require('util');
var Collection = require('./Db').Collection;
exports.GameDataCollection = GameDataCollection;

function GameDataCollection(cb) {
    assert.ok(global.mush);
    var self = this;

    GameDataCollection.super_.call(this, 'mush_data', function(err, collection) {
        if (err) {
            cb(err);
            return;
        }
        self.isEmpty(function(err, empty) {
            if (err) {
                cb('There was an error in isEmpty');
                return;
            }
            assert.ok(typeof empty === 'boolean');
            if (!empty) {
                self.findAll(function(err, dataArray) {
                    assert.ok(!err);
                    console.log('dataArray: '+util.inspect(dataArray));
                    assert.ok(dataArray);
                    assert.ok(typeof dataArray === 'object');
                    assert.ok(dataArray.length === 1);
                    self._data = dataArray[0];
                    console.log('gameData: '+util.inspect(self._data));
                    assert.ok(self._data);
                    assert.ok(self._data.freeList);
                    assert.ok(typeof self._data.freeList === 'object');
                    assert.ok(self._data.nextId !== undefined);
                    assert.ok(self._data.nextId >= 0);
                });
                cb(null, self);
                return;
            } else {
                self._data = {};
                self._data.freeList = [];
                self._data.nextId = 0;
                self.insert(self._data, function(err, obj) {
                    if (err) {
                        cb(err);
                        return;
                    }
                    console.log('Game data inserted: '+util.inspect(obj));
                    cb(null, self);
                });
            }
        });
    });
}

util.inherits(GameDataCollection, Collection);

GameDataCollection.prototype.freeListNotEmpty = function() {
    assert.ok(this._data);
    assert.ok(this._data.freeList);
    if (this._data.freeList.length > 0)
        return true;
    return false;
};

GameDataCollection.prototype.popFreeList = function() {
    assert.ok(this._data);
    assert.ok(this._data.freeList);
    assert.ok(this._data.freeList.length > 0);
    var id = this._data.freeList.pop();
    this.update(this._data, function(err, data) {
        if (err)
            console.error('There was an error updating the game data collection.');
    });
    return id;
};

GameDataCollection.prototype.pushFreeList = function(id) {
    assert.ok(id);
    assert.ok(this._data);
    assert.ok(this._data.freeList);
    assert.ok(this._data.freeList.length > 0);
    var id = this._data.freeList.push(id);
    this.update(this._data, function(err, data) {
        if (err)
            console.error('There was an error updating the game data collection.');
    });
};

GameDataCollection.prototype.getNextId = function() {
    assert.ok(this._data);
    assert.ok(this._data.nextId !== 'undefined');
    assert.ok(this._data.nextId >= 0);
    assert.ok(this._data.freeList);

    var id;

    if (this._data.freeList.length > 0)
        id =  this.popFreeList();
    else
        id = this._data.nextId++;

    this.update(this._data, null, function(err, data) {
        if (err)
            console.error('There was an error updating the game data collection.');
    });
    return id;
};
