'use strict';

var Db = require('mongodb').Db;
var assert = require('assert');
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
exports.Collection = Collection;

function Collection(collectionName, cb) {
    assert.ok(mush && mush.db);
    assert.ok(collectionName && typeof collectionName === 'string');
    assert.ok(collectionName.length);
    this.collectionName = collectionName;
    this.getCollection(cb);
}

Collection.prototype.getCollection = function(cb) {
    assert.ok(this.collectionName && typeof this.collectionName === 'string');
    assert.ok(this.collectionName.length);
    var self = this;
    mush.db.collection(this.collectionName, function(error, dbCollection) {
        if (error) {
            cb(error);
            return;
        }
        self.dbCollection = dbCollection;
        cb(null, dbCollection);
    });
};

Collection.prototype.findAll = function(cb) {
    this.dbCollection.find().toArray(function(error, results) {
        if (error) {
            cb(error);
            return;
        }
        cb(null, results)
    });
};

Collection.prototype.findByName = function(name, cb) {
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

Collection.prototype.update = function(obj, cb) {
    assert.ok(this.dbCollection);
    assert.ok(obj);
    assert.ok(obj._id);
    assert.ok(cb);
    this.dbCollection.update({_id: obj._id}, function(err, updatedObj) {
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
    assert.ok(cb);
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

Collection.prototype.isEmpty = function() {
    var self = this;
    if (this.dbCollection.find().limit(1) === 1)
        return false;
    return true;
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
