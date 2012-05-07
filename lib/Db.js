'use strict';

var Db = require('mongodb').Db;
var assert = require('assert');
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

exports.ObjectProvider = ObjectProvider;

function ObjectProvider(collection, cb) {

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

    this.db = new Db(dbName, new Server(dbHost, dbPort, dbCfg, {}));
    this.db.open(function(){});
    this.getCollection(cb);
}

ObjectProvider.prototype.getCollection = function(cb) {
    var self = this;

    this.db.collection('players', function(error, playerCollection) {
        if (error) {
            cb(error);
            return;
        }
        self.playerCollection = playerCollection;
        cb(null, playerCollection);
    });
};

ObjectProvider.prototype.findAll = function(cb) {
    this.playerCollection.find().toArray(function(error, results) {
        if (error) {
            cb(error);
            return;
        }
        cb(null, results)
    });
};

ObjectProvider.prototype.findByName = function(playerName, cb) {
    var self = this;

    this.playerCollection.findOne({name : playerName},
        function(error, player) {
            if (error) {
                cb(error);
                return;
            }
            cb(null, player);
        }
    );
};

ObjectProvider.prototype.findById = function(id, cb) {
    var self = this;

    this.playerCollection.findOne(
        {_id: self.playerCollection.db.bson_serializer.ObjectID.createFromHexString(id)},
        function(error, result) {
            if (error) {
                cb(error);
                return;
            }
            cb(null, result)
        }
    );
};

ObjectProvider.prototype.createPlayer = function(playerName, password, cb) {
    if (typeof playerName === "undefined" || playerName.length === 0) {
        cb('The argument \'playerName\' was undefined or an empty string.');
        return;
    }

    if (typeof password === "undefined" || password.length === 0) {
        cb('The argument \'password\' was undefined or an empty string.');
        return;
    }

    // create new player obj
    var player = {};

    // add default data
    player.name = playerName;
    player.cdate = new Date();
    player.pass = password;
    player.sex = 'n';
    player.last = player.cdate;
    player.desc = 'You see a person with many possibilities.';

    this.playerCollection.insert(player, function(err, newPlayer) {
        if (err) {
            console.error('Error: '+err);
            return;
        }
        if (Object.prototype.toString.call(newPlayer) === '[object Array]')
            newPlayer = newPlayer[0];
        cb(null, newPlayer);
        // FIXME add id and set owner to that id
    });
};
