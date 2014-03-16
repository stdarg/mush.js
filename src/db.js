/**
 * @fileOverview
 * The Db class encapsulates the use of LevelDb.
 */
'use strict';
var levelup = require('level');

var GAME_DATA_ID = '-1';
module.exports = Db;

/**
 * The Db object is a base class for all objects that need to work with MongoDB
 * Dbs.
 * @param {string} name The name of the Db to work with.
 * @param {function} cb The callback to execute when the Db is ready for use.
 */
function Db(fileName, cb) {
    assert.ok(is.nonEmptyStr(fileName));
    assert.ok(is.func(cb));

    var self = this;
    self.fileName = fileName;
    self.freeList = [];
    self.nextId = 0;

    self.open(function(err, db) {
        assert.ok(is.int(self.nextId) && self.nextId > -1);
        if (err)  return cb(err);
        assert.ok(is.nonEmptyObj(db));
        log.info('Connected to the DB.');
        assert.ok(is.obj(global.mush));
        mush.db = self;
        self.db = db;
        self.objArray = [];
        self.readAll(cb);
    });
}

/**
 * Opens the data base for queries.
 * @param {Function} cb Callback of form fn(err)
 * @private
 */
Db.prototype.open = function(cb) {
    var self = this;
    assert.ok(is.nonEmptyStr(self.fileName));
    assert.ok(is.func(cb));
    assert.ok(is.int(self.nextId) && self.nextId > -1);

    var options = {
        createIfMissing: true,
        errorIfExists: false,
        compression: true,
        cacheSize: 32 * 1024 * 1024,
        keyEncoding: 'utf8',
        valueEncoding: 'json',
    };

    // This will create or open the underlying LevelDB store.
    levelup(self.fileName, options, function(err, db) {
        cb(err, db);
    });
};

/**
 * Close the database.
 * @param {Function} cb The cabblack of form: fn(err).
 */
Db.prototype.close = function(cb) {
    var self = this;
    assert.ok(is.func(cb));
    self.db.close(function(err) {
        if (err)  mush_utils.logErr(err);
        cb(err);
    });
};

/**
 * Read all the objects in the db, to get certain info quickly available,
 * e.g. owner, name, loc, type & flags.
 * @param {Function} cb Callback of form fn(err)
 * @private
 */
Db.prototype.readAll = function(cb) {
    var self = this;
    assert.ok(is.func(cb));
    assert.ok(is.nonEmptyObj(self.db));
    assert.ok(self.db.isOpen() === true);

    log.info('Db.init starting read stream of db.');
    // read all the objects in the db
    self.db.createReadStream()
    .on('data', function(data) {
        if (data.key === GAME_DATA_ID) {
            log.info('Found game data: %j',data);
            // {"id":"-1","nextId":null}
            if (is.array(data.value.freeList) && data.value.freeList.length)
                self.freeList = data.freeList;
            if (data.value.nextId)
                self.nextId = data.value.nextId;
            assert.ok(is.int(self.nextId) && self.nextId > -1);
            log.info('self.nextId %d',self.nextId);
            return;
        }
        log.info('%d = %j', data.key, data.value);
        assert.ok(data.key === data.value.id);
        self.storeObjData(data.value);
    })
    .on('error', function (err) {
        if (err) mush_utils.logErr('Db.init createReadStream', err);
    })
    .on('close', function () {
        log.info('Db.init read stream of db closed.');
        cb(null, self);
    })
    .on('end', function () {
        log.info('Db.init read stream of db ended.');
    });
};

/**
 * Save the nextId and the free list to the database
 * @param {Function} cb Callback of form fn(err)
 * @private
 */
Db.prototype.saveGameData = function(cb) {
    var self = this;
    var obj = {
        id: '-1',
        freeList: self.freeList,
        nextId: self.nextId
    };
    self.put(obj, function(err) {
        if (err) mush_utils.logErr('Db.saveGameData', err);
        if (cb)
            cb(err);
    });
};

/**
 * Save the object data so it is at hand
 * @param {Function} cb Callback of form fn(err)
 * @private
 */
Db.prototype.storeObjData = function(obj) {
    var self = this;
    assert.ok(is.nonEmptyObj(obj));
    log.info('obj: %j', obj);
    assert.ok(self.validId(obj.id));
    self.objArray[obj.id] = {};
    if (obj.type === 'p') {
        mush.Factory.playerFromDbObj(obj, function(err) {
            if (err) mush_utils.logErr('Db.storeObjData', err);
        });
    }
    /*
    if (is.nonEmptyStr(obj.name))
        self.objArray[obj.id].name = obj.name;
    if (is.int(obj.loc))
        self.objArray[obj.id].loc = obj.loc;
    if (is.nonEmptyStr(obj.type))
        self.objArray[obj.id].type = obj.type;
    */
};

/**
 * Find an object in the collection by the 'id' field. Not the '_id' set by Mongo.
 * @param {int} id The id number of the object desired.
 * @param {function} cb The call to execute when done, returns the error or player document.
 */
Db.prototype.get = function(id, cb) {
    var self = this;
    log.info('Db.get id: %s',id);
    assert.ok(self.validId(id));
    assert.ok(is.func(cb));
    assert.ok(is.nonEmptyObj(self.db));
    assert.ok(self.db.isOpen() === true);
    self.db.get(id, function(err, value) {
        if (err)  mush_utils.logErr(err);
        return cb(err, value);
    });
};

/**
 * Given an object, place it into the db. If it is already there, it will be 
 * over-written.
 * @param {Object} obj An object representing the document to be updated.
 * @param {Function} cb The call to execute when done, returns the error or obj document.
 */
Db.prototype.put = function(obj, cb) {
    var self = this;
    assert.ok(is.nonEmptyObj(obj));
    console.log('\nobj',JSON.stringify(obj));
    assert.ok(self.validId(obj.id));
    assert.ok(is.func(cb));
    assert.ok(is.nonEmptyObj(self.db));
    assert.ok(self.db.isOpen());
    self.db.put(obj.id, obj, function(err) {
        if (err)  mush_utils.logErr(err);
        cb(err);
    });
};

/**
 * Inserts a document into the Db. I wonder if I should
 * modify update to be upsert? Or make an upsert method?
 * @param {object} obj An object representing the document to be inserted.
 * @param {function} cb The callback to execute upon completion with an error or the document.
 */
Db.prototype.del = function(id, cb) {
    var self = this;
    assert.ok(self.validId(id));
    assert.ok(is.func(cb));
    assert.ok(is.nonEmptyObj(self.db));
    assert.ok(self.db.isOpen());
    self.db.del(id, function(err) {
        if (err)  mush_utils.logErr(err);
        cb(err);
    });
};

/**
 * Find if the Db is empty or not.
 * @param {function} cb The callback to execute upon completion with an error or a bool,
 * true if empty.
 */
Db.prototype.isEmpty = function() {
    var self = this;
    assert.ok(is.array(self.objArray));
    return self.objArray.length === 0;
};

/**
 * Get the next available id, then increment the next available and save it to
 * the db.
 * @return {Number} an integer id >= 0
 */
Db.prototype.getNextId = function() {
    var self = this;
    log.info('typeof self.nextId "%s"',typeof self.nextId);
    log.info('self.nextId "%j"',self.nextId);
    assert.ok(is.int(self.nextId) && self.nextId > -1);
    if (is.defined(self.nextId))
        log.info('self.nextId %j',self.nextId);
    else
        log.info('self.nextId is NOT defined');
    var id = self.nextId++;
    self.saveGameData();
    id = id+'';
    log.info('nextId %s',id);
    assert.ok(self.validId(id));
    return id;
};

/**
 * Returns true if a valid id.
 * @return {Boolean} true, if a valid id.
 */
Db.prototype.validId = function(id) {
    var self = this;
    if (!is.nonEmptyStr(id)) {
        log.error('id is not a string: "%s"',typeof id);
        return false;
    }
    var num = parseInt(id, 10);
    log.info('num=%d, self.nextId=%d', num, self.nextId);
    if (isNaN(num) || num < -1 || num >= self.nextId) {
        log.error('id is not a number between -1 and %d: %s',self.nextId, id);
        return false;
    }
    return true;
};
