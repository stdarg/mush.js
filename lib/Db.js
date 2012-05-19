'use strict';

var assert = require('assert');
var util = require('util');
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var is = require('./is');

exports.Collection = Collection;

function Collection(name, cb) {
    assert.ok(mush && mush.db);
    assert.ok(is.nonEmptyStr(name));
    assert.ok(is.func(cb));

    this.name = name;
    this.getCollection(cb);
}

Collection.prototype.getName = function() {
    assert.ok(is.nonEmptyStr(this.name));
    return this.name;
};

Collection.prototype.getCollection = function(cb) {
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

Collection.prototype.update = function(obj, fields, cb) {
    assert.ok(is.object(obj));
    assert.ok(this.dbCollection);
    assert.ok(is.object(obj));
    assert.ok(is.int(obj._id));
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

Collection.prototype.count = function(cb) {
    assert.ok(is.func(cb));
    assert.ok(this.dbCollection);

    this.dbCollection.find().count(function(err, count) {
        assert.ok(err || count);
        cb(err, count);
    });
};

Collection.prototype.isEmpty = function(cb) {
    assert.ok(typeof cb === 'function');
    this.dbCollection.find().count(function(err, count) {
        assert.ok(err || count);
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

////////////////////////////////////////////////////////////////////////////////

exports.connect = function(cb) {
    assert.ok(is.func(cb));

    // get config info
    var dbName = global.mush.config.get('mongodb.dbName', 'mush.js');
    var dbHost = global.mush.config.get('mongodb.host', '127.0.0.1');
    var dbPort = global.mush.config.get('mongodb.port', 27017);
    assert.ok(is.nonEmptyStr(dbName));
    assert.ok(is.nonEmptyStr(dbHost));
    assert.ok(is.int(dbPort));

    var dbCfg_def = {
        auto_reconnect : true,
        slaveOk : true,
        strict : false,
    };

    var dbCfg = global.mush.config.get('mongodb.dbCfg', dbCfg_def);
    assert.ok(is.object(dbCfg));

    var db = new Db(dbName, new Server(dbHost, dbPort, dbCfg, {}));
    assert.ok(db);

    db.open(function(err, db) {
        assert.ok(err || db);
        cb(err, db);
    });
};
