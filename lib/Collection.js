/*!
 * The Collection class is a base class for GameDataCollection, PlayerCollection, and
 * ObjectCollection. A collection in MongoDB is like a table, kinda.
 */

'use strict';

var assert = require('assert');
var util = require('util');
var is = require('is2');

exports.Collection = Collection;

/**
 * The Collection object is a base class for all objects that need to work with MongoDB
 * collections.
 * @param {string} name The name of the collection to work with.
 * @param {function} cb The callback to execute when the collection is ready for use.
 */
function Collection(name, cb) {
    assert.ok(mush && mush.db);
    assert.ok(is.nonEmptyStr(name));
    assert.ok(is.func(cb));

    this.name = name;
    this._getCollection(cb);
}

/**
 * Returns the name of the collection.
 * @returns {string} The name of the collection.
 */
Collection.prototype.getName = function() {
    assert.ok(is.nonEmptyStr(this.name));
    return this.name;
};

/**
 * Gets a handle to the mongodb collection with which, we can query and do useful
 * things.
 * @api private
 * @param {function} cb The call to execute when done, returns the error or collection handle.
 */
Collection.prototype._getCollection = function(cb) {
    assert.ok(mush && mush.db);
    assert.ok(is.nonEmptyStr(this.name));
    assert.ok(is.func(cb));

    var self = this;
    mush.db.collection(this.name, function(error, dbCollection) {
        if (error) {
            cb(error);
            return;
        }
        self.dbCollection = dbCollection;
        cb(null, dbCollection);
    });
};

/**
 * What this does right now is return the single document used by the GameData collection.
 * FIXME: Either make more generic or move into game collection object.
 * @api private
 * @param {function} cb The call to execute when done, returns the error or collection handle.
 */
Collection.prototype.findAll = function(cb) {
    assert.ok(is.func(cb));

    var cursor = this.dbCollection.find({}, ['nextId', 'freeList']);
    cursor.toArray(function(err, docArray) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            cb(err);
            return;
        }
        assert.ok(is.nonEmptyArray(docArray));
        cb(null, docArray)
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
Collection.prototype.findByName = function(name, cb) {
    assert.ok(is.nonEmptyStr(name));
    assert.ok(is.func(cb));

    var self = this;
    this.dbCollection.findOne({name : name},
        function(err, obj) {
            if (err) {
                assert.ok(is.nonEmptyStr(err));
                cb(err);
                return;
            }
            cb(null, obj);
        }
    );
};

/**
 * Finds an object in a collection by mongodb id (not game id).
 * Not used. Not sure if it ever will be.
 * FIXME: Use or lose.
 * @param {string} id A hex string repsenting the mongo db id of the document.
 * @param {string} cb The call to execute when done, returns the error or obj document.
 */
Collection.prototype.findById = function(id, cb) {
    assert.ok(is.int(id));
    assert.ok(is.func(cb));

    var self = this;
    this.dbCollection.findOne(
        {_id: self.dbCollection.db.bson_serializer.ObjectID.createFromHexString(id)},
        function(error, result) {
            if (err) {
                assert.ok(is.nonEmptyStr(err));
                cb(err);
                return;
            }
            cb(null, result)
        }
    );
};

/**
 * Given an object, a list of fields to update and a callback, update will update the
 * object in the collection.
 * @param {object} obj An object representing the document to be updated.
 * @param {string[]} [fields] An array of strings, indicating which fields to update (optional)
 * @param {string} cb The call to execute when done, returns the error or obj document.
 */
Collection.prototype.update = function(obj, fields, cb) {
    console.log('Collection.update: '+util.inspect(obj));
    assert.ok(is.object(obj));
    assert.ok(this.dbCollection);
    assert.ok(is.object(obj));
    assert.ok(is.obj(obj._id));
    assert.ok(is.func(cb));

    var set = {};
    set.$set = {};

    if (fields && fields.length >= 1) {
        fields.forEach(function (element, index, array) {
            set.$set[element] = obj[element];
        });
    } else {
        for (var prop in obj) {
            if (prop == '_id')
                continue;
            set.$set[prop] = obj[prop];
        }
    }

    this.dbCollection.update({_id: obj._id}, set, {safe: true}, function(err, updatedObj) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            console.error('Error: '+err);
            return;
        }
        if (is.array(updatedObj))
            updatedObj = updatedObj[0];
        cb(null, updatedObj);
    });
};

/**
 * Inserts a document into the collection. I wonder if I should
 * modify update to be upsert? Or make an upsert method?
 * @param {object} obj An object representing the document to be inserted.
 * @param {function} cb The callback to execute upon completion with an error or the document.
 */
Collection.prototype.insert = function(obj, cb) {
    assert.ok(this.dbCollection);
    assert.ok(is.object(obj));
    assert.ok(is.func(cb));

    this.dbCollection.insert(obj, function(err, newObj) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            console.error('Error: '+err);
            return;
        }
        if (is.array(newObj))
            newObj = newObj[0];
        cb(null, newObj);
    });
};

/**
 * Find the number of objects in the collection. I believe this is an O(N) operation. :(
 * We'll want to store counts in the object and keep track as we go.
 * @param {function} cb The callback to execute upon completion with an error or the count.
 */
Collection.prototype.count = function(cb) {
    assert.ok(is.func(cb));
    assert.ok(this.dbCollection);

    this.dbCollection.find().count(function(err, count) {
        assert.ok(err || count);
        cb(err, count);
    });
};

/**
 * Find if the collection is empty or not.
 * @param {function} cb The callback to execute upon completion with an error or a bool,
 * true if empty.
 */
Collection.prototype.isEmpty = function(cb) {
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
