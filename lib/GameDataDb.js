/**
 * GameDataDb is a
 */

'use strict';
var Db = require('./Db').Db;

exports.GameDataDb = GameDataDb;

util.inherits(GameDataDb, Db);

function GameDataDb(cb) {
    assert.ok(global.mush);
    assert.ok(is.func(cb));

    var self = this;

    GameDataDb.super_.call(this, 'mush_data', function(err, Db) {
        if (err) {
            return cb(err);
        }
        self.isEmpty(function(err, empty) {
            if (err) {
                return cb('There was an error in isEmpty: '+err);
            }

            assert.ok(is.bool(empty));

            if (!empty) {
                log.info('GameDataDb: GameData Db is NOT empty.');
                self.findAll(function(err, dataArray) {
                    assert.ok(!err);
                    assert.ok(is.nonEmptyArray(dataArray));
                    self._data = dataArray[0];
                    log.info('GameDataDb: self._data: %j', self._data);
                    assert.ok(self._data);
                    assert.ok(self._data.freeList);
                    assert.ok(is.array(self._data.freeList));
                    assert.ok(is.int(self._data.nextId));
                    assert.ok(self._data.nextId >= 0);
                    cb(undefined, self);
                });
                return;
            } else {
                log.info('GameDataDb: The GameData Db IS empty.');
                self._data = {};
                self._data.freeList = [];
                self._data.nextId = 0;
                self.insert(self._data, function(err, obj) {
                    if (err) {
                        return cb(err);
                    }
                    assert.ok(is.obj(obj));
                    cb(null, self);
                });
            }
        });
    });
}


GameDataDb.prototype.freeListNotEmpty = function() {
    assert.ok(is.obj(this._data));
    assert.ok(is.array(this._data.freeList));

    if (this._data.freeList.length > 0)
        return true;
    return false;
};

GameDataDb.prototype.popFreeList = function() {
    assert.ok(this._data);
    assert.ok(is.nonEmptyArray(this._data.freeList));

    var id = this._data.freeList.pop();
    this.update(this._data, function(err, data) {
        if (err)
            log.error('GameDataDb.popFreeList: There was an error updating the game data Db: %j', err);
    });
    return id;
};

GameDataDb.prototype.pushFreeList = function(id) {
    assert.ok(is.int(id));
    assert.ok(is.obj(this._data));
    assert.ok(is.array(this._data.freeList));

    id = this._data.freeList.push(id);
    this.update(this._data, function(err, data) {
        if (err)
            log.error('GameDataDb.pushFreeList: There was an error updating the game data Db: %j', err);
    });
};

GameDataDb.prototype.getNextId = function() {
    log.info('GameDataDb.getNextId: this._data: %j', this._data);
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
            log.error('GameDataDb.getNextId: There was an error updating the game data Db: %j', err);
    });
    return id;
};
