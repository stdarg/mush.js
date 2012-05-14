'use strict';

var assert = require('assert');
var util = require('util');
var is = require('./is').is;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
exports.Collection = Collection;

function Collection(name, cb) {
    assert.ok(mush && mush.db);
    assert.ok(name && is.string(name) && name.length > 0);
    this.name = name;
    this.getCollection(cb);
}

Collection.prototype.getName = function() {
    return this.name;
};

Collection.prototype.getCollection = function(cb) {
    assert.ok(mush && mush.db);
    assert.ok(is.nonEmptyStr(this.name));
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
            cb(err);
            return;
        }
        assert.ok(docArray);
        assert.ok(docArray.length !== undefined);
        assert.ok(docArray.length >= 1);
        console.log('Num found: '+docArray.length);
        console.log('docArray: '+util.inspect(docArray));
        cb(null, docArray)
    });
};

Collection.prototype.findByName = function(name, cb) {
    assert.ok(is.nonEmptyStr(name));
    assert.ok(is.func(cb));
    var self = this;
    this.dbCollection.findOne({name : name},
        function(error, obj) {
            if (error) {
                cb(error);
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
            if (error) {
                cb(error);
                return;
            }
            cb(null, result)
        }
    );
};

Collection.prototype.update = function(obj, fields, cb) {
    assert.ok(is.object(obj));
    assert.ok(this.dbCollection);
    assert.ok(obj);
    assert.ok(obj._id);
    assert.ok(cb);

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

    console.log('set '+util.inspect(set));

    this.dbCollection.update({_id: obj._id}, set, {safe: true}, function(err, updatedObj) {
        if (err) {
            console.error('Error: '+err);
            return;
        }   
        if (Object.prototype.toString.call(updatedObj) === '[object Array]')
            updatedObj = updatedObj[0];
        cb(null, updatedObj);
    });
};

Collection.prototype.insert = function(obj, cb) {
    assert.ok(this.dbCollection);
    assert.ok(obj);
    assert.ok(typeof cb === 'function');
    this.dbCollection.insert(obj, function(err, newObj) {
        if (err) {
            console.error('Error: '+err);
            return;
        }
        if (Object.prototype.toString.call(newObj) === '[object Array]')
            newObj = newObj[0];
        cb(null, newObj);
    });
};

Collection.prototype.count = function(cb) {
    this.dbCollection.find().count(function(err, count) {
        cb(err, count);
    });
};

Collection.prototype.isEmpty = function(cb) {
    assert.ok(typeof cb === 'function');
    this.dbCollection.find().count(function(err, count) {
        if (err) {
            cb(err);
            return;
        }
        var empty = count===0 ? true : false;
        cb(null, empty);
    });
};

////////////////////////////////////////////////////////////////////////////////

exports.connect = function(cb) {
    // get config info
    var dbName = global.mush.config.get('mongodb.dbName', 'mush.js');
    var dbHost = global.mush.config.get('mongodb.host', '127.0.0.1');
    var dbPort = global.mush.config.get('mongodb.port', 27017);

    var dbCfg_def = {
        auto_reconnect : true,
        slaveOk : true,
        strict : false,
    };
    var dbCfg = global.mush.config.get('mongodb.dbCfg', dbCfg_def);
    var db = new Db(dbName, new Server(dbHost, dbPort, dbCfg, {}));
    db.open(function(err, db) {
        cb(err, db);
    });
};
