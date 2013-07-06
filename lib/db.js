/**
 * @fileOverview
 * The Db class is a base class for GameDataDb, PlayerDb, and
 * ObjectDb.
 */

'use strict';
exports.Db = Db;

/**
 * The Db object is a base class for all objects that need to work with MongoDB
 * Dbs.
 * @param {string} name The name of the Db to work with.
 * @param {function} cb The callback to execute when the Db is ready for use.
 */
function Db(name, cb) {
    assert.ok(mush && mush.db);
    assert.ok(is.nonEmptyStr(name));
    assert.ok(is.func(cb));

    this.name = name;
    this._getDb(cb);
}

/**
 * Returns the name of the Db.
 * @returns {string} The name of the Db.
 */
Db.prototype.getName = function() {
    assert.ok(is.nonEmptyStr(this.name));
    return this.name;
};

/**
 * Gets a handle to the mongodb Db with which, we can query and do useful
 * things.
 * @api private
 * @param {function} cb The call to execute when done, returns the error or Db handle.
 */
Db.prototype._getDb = function(cb) {
    assert.ok(mush && mush.db);
    assert.ok(is.nonEmptyStr(this.name));
    assert.ok(is.func(cb));

    var self = this;
    mush.db.collection(this.name, function(error, dbDb) {
        if (error) {
            cb(error);
            return;
        }
        self.dbCollection = dbDb;
        cb(null, dbDb);
    });
};

/**
 * What this does right now is return the single document used by the GameData Db.
 * FIXME: Either make more generic or move into game Db object.
 * @api private
 * @param {function} cb The call to execute when done, returns the error or Db handle.
 */
Db.prototype.findAll = function(cb) {
    assert.ok(is.func(cb));

    var cursor = this.dbCollection.find({}, ['nextId', 'freeList']);
    cursor.toArray(function(err, docArray) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            cb(err);
            return;
        }
        assert.ok(is.nonEmptyArray(docArray));
        cb(null, docArray);
    });
};

/**
 * This is only used in Commands.js when players create or connect. Normally, you would not
 * find an object by name in a collect, exception for player, where every player has a unique
 * name.
 * FIXME: Either make generic or move to players.
 * @param {string} name The name of the object you wish to find
 * @param {function} cb The call to execute when done, returns the error or player document.
 */
Db.prototype.findByName = function(name, cb) {
    assert.ok(is.nonEmptyStr(name));
    assert.ok(is.func(cb));

    this.dbCollection.findOne({name : name},
        function(err, obj) {
            if (err) return cb(err);
            cb(null, obj);
        }
    );
};

/**
 * Find an object in the collection by the 'id' field. Not the '_id' set by Mongo.
 * @param {int} id The id number of the object desired.
 * @param {function} cb The call to execute when done, returns the error or player document.
 */
Db.prototype.findById = function(id, cb) {
    assert.ok(is.int(id) && id >= 0);
    assert.ok(is.func(cb));

    this.dbCollection.findOne({id : id},
        function(err, obj) {
            if (err) return cb(err);
            cb(null, obj);
        }
    );
};

/**
 * Finds an object in a Db by mongodb id (not game id).
 * Not used. Not sure if it ever will be.
 * FIXME: Use or lose.
 * @param {string} id A hex string repsenting the mongo db id of the document.
 * @param {string} cb The call to execute when done, returns the error or obj document.
 */
Db.prototype.findBy_Id = function(id, cb) {
    log.error('typeof id: %s', typeof id);
    assert.ok(is.int(id));
    assert.ok(is.func(cb));

    var self = this;
    this.dbCollection.findOne(
        {_id: self.dbCollection.db.bson_serializer.ObjectID.createFromHexString(id)},
        function(err, result) {
            if (err) {
                assert.ok(is.nonEmptyStr(err));
                cb(err);
                return;
            }
            cb(null, result);
        }
    );
};

/**
 * Given an object, a list of fields to update and a callback, update will update the
 * object in the Db.
 * @param {object} obj An object representing the document to be updated.
 * @param {string[]} [fields] An array of strings, indicating which fields to update (optional)
 * @param {string} cb The call to execute when done, returns the error or obj document.
 */
Db.prototype.update = function(obj, fields, cb) {
    log.info('Db.update: %j', obj);
    assert.ok(is.object(obj));
    assert.ok(this.dbCollection);
    assert.ok(is.object(obj));
    assert.ok(is.obj(obj._id));
    assert.ok(is.func(cb));

    var set = {};
    set.$set = {};

    if (fields && fields.length >= 1) {
        fields.forEach(function (element) {
            set.$set[element] = obj[element];
        });
    } else {
        for (var prop in obj) {
            if (prop === '_id')
                continue;
            set.$set[prop] = obj[prop];
        }
    }

    this.dbCollection.update({_id: obj._id}, set, {safe: true}, function(err, updatedObj) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            log.error('Error: Db.update: '+err);
            return;
        }
        if (is.array(updatedObj))
            updatedObj = updatedObj[0];
        cb(null, updatedObj);
    });
};

/**
 * Inserts a document into the Db. I wonder if I should
 * modify update to be upsert? Or make an upsert method?
 * @param {object} obj An object representing the document to be inserted.
 * @param {function} cb The callback to execute upon completion with an error or the document.
 */
Db.prototype.insert = function(obj, cb) {
    assert.ok(this.dbCollection);
    assert.ok(is.object(obj));
    assert.ok(is.func(cb));

    this.dbCollection.insert(obj, function(err, newObj) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            log.error('Error: Db.insert: '+err);
            return;
        }
        if (is.array(newObj))
            newObj = newObj[0];
        cb(null, newObj);
    });
};

/**
 * Find the number of objects in the Db. I believe this is an O(N) operation. :(
 * We'll want to store counts in the object and keep track as we go.
 * @param {function} cb The callback to execute upon completion with an error or the count.
 */
Db.prototype.count = function(cb) {
    assert.ok(is.func(cb));
    assert.ok(this.dbCollection);

    this.dbCollection.find().count(function(err, count) {
        assert.ok(err || count);
        cb(err, count);
    });
};

/**
 * Find if the Db is empty or not.
 * @param {function} cb The callback to execute upon completion with an error or a bool,
 * true if empty.
 */
Db.prototype.isEmpty = function(cb) {
    assert.ok(typeof cb === 'function');
    this.dbCollection.find().count(function(err, count) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            cb(err);
            return;
        }

        assert.ok(is.int(count));
        var empty = count===0 ? true : false;
        cb(null, empty);
    });
};
