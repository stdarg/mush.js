/**
 * This the file that is run when you want to start mush.js.
 * Here, we set up the database collections and then start the
 * server.
 */
'use strict';           // Forces better usage of JavaScript.
var util = require('util');
var assert = require('assert');
var async = require('async');

require('./sprintf');   // adds a sprintf in the global-scope and a printf on string objs
var is = require('./is');
var Db = require('./Db');
var PlayerCollection = require('./DbPlayers').PlayerCollection;
var GameDataCollection = require('./DbGameData').GameDataCollection;
var ObjectCollection = require('./DbObjects').ObjectCollection;
var Server = require('./Server').Server;
var Config = require('./Config').Config;

/**
 * Start the mush.
 */
function startTheMush() {
    // at this point, the db is connected
    console.log('Starting server.');
    assert.ok(mush);
    global.mush.Server = new Server();
    global.mush.Server.start();
}

/**
 * save the object collection into the global mush object
 * @param {string} err If defined, there was an error.
 * @param {object} collection A mongodb collection
 */
function getPlayerCollection(cb) {
    new PlayerCollection(function(err, players) {
        if (err) {
            cb('There was an error connecting to the player collection.');
            return;
        }
        assert.ok(global.mush);
        console.log('Got the player collection.');
        global.mush.players = players;
        assert.ok(global.mush.players);
        cb();
    });
}

/**
 * Get the object colection, which contains rooms, exits and objects
 */
function getObjectCollection(cb) {
    assert.ok(global.mush);
    assert.ok(global.mush.data);
    assert.ok(global.mush.data.getNextId);
    new ObjectCollection(function(err, objects) {
        if (err) {
            cb('There was an error connecting to the object collection.');
            return;
        }
        global.mush.objects = objects;
        console.log('Got the object collection.');
    });
    cb();
}

function getGameDataCollection(cb) {
    assert.ok(global.mush);
    new GameDataCollection(function(err, data) {
        if (err) {
            cb('There was an error connecting to the game data collection: ');
            return;
        }
        console.log('Got the game data collection.');
        global.mush.data = data;
        cb();
    });
}

/**
 * save the db connection to the global mush object.
 * @param {string} err If defined, there was an error.
 * @param {object} db A mongodb db object.
 */
function connectToDb(cb) {
    Db.connect(function(err, db) {
        if (err) {
            cb('There was an error connecting to the database.');
            return;
        }
        assert.ok(db !== undefined);
        global.mush.db = db;
        console.log('Connected to DB.');
        cb();
    });
}

/**
 * sets up the global mush object, which has the config and db objects.
 * After this function global.mush will be just mush.
 * @param {function} cb A callback with 1 param, err, indicating an error
 */
function main() {
    // set up some global objects
    global.mush = {};
    global.mush.config = new Config('../cfg/mush_config.js', 'us');

    // execute a set of function sequentially, and then execute the callback
    // which is an anonymous function that starts the mush.
    async.series( [
            connectToDb,                // must be first
            getGameDataCollection,      // must be second
            getObjectCollection,
            getPlayerCollection,
        ],

        function(err, results) {
            if (err) {
                console.error(err);
                return;
            }
            startTheMush();
        }
    );
}

main();     // we have to invoke main (barbaric!)
