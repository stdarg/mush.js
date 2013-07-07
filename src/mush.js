/**
 * @fileOverview
 * This the file that is run when you want to start mush.js.
 * Here, we set up the database collections and then start the
 * server.
 */
'use strict';           // Forces better usage of JavaScript.
var Config = require('config-js').Config;

// set up some global objects
global.mush = {};
global.mush.config = new Config('../cfg/mush_config.js', 'us');
global.mush_utils = require('./mush_utils');
global.log = mush_utils.createLogger();
global.is = require('is2');
global.util = require('util');
global.assert = require('assert');
require('sprintf.js');   // adds a sprintf in the global-scope and a printf on string objs

var async = require('async');
var PlayerDb = require('./player_db').PlayerDb;
var GameDataDb = require('./game_data_db').GameDataDb;
var ObjectDb = require('./object_db').ObjectDb;
var Server = require('./server').Server;

// This is where the aplication code starts running
main();

/**
 * Start the mush.
 */
function startTheMush() {
    // at this point, the db is connected
    log.info('Starting server.');
    assert.ok(mush);
    global.mush.Server = new Server();
    global.mush.Server.start();
}

/**
 * save the object collection into the global mush object
 * @param {Function} cb A callback to signal the work is done
 */
function getPlayerDb(cb) {
    new PlayerDb(function(err, players) {
        if (err) {
            cb('There was an error connecting to the player collection.');
            return;
        }
        assert.ok(global.mush);
        log.info('Got the player collection.');
        global.mush.players = players;
        assert.ok(global.mush.players);
        cb();
    });
}

/**
 * Get the object colection, which contains rooms, exits and objects
 * and places the collection in the global scope.
 * @param {Function} cb A callback to signal the work is done
 */
function getObjectDb(cb) {
    assert.ok(global.mush);
    assert.ok(global.mush.data);
    assert.ok(global.mush.data.getNextId);
    new ObjectDb(function(err, objects) {
        if (err) {
            cb('There was an error connecting to the object collection.');
            return;
        }

        assert.ok(is.nonEmptyObj(objects));

        global.mush.objects = objects;
        log.info('Got the object collection.');
        cb();
    });
}

/**
 * Get the game data db which has the freelist and the next available dbref and
 * place it in the global scope.
 * @param {Function} cb A callback to signal the work is done
 */
function getGameDataDb(cb) {
    assert.ok(global.mush);
    new GameDataDb(function(err, data) {
        if (err) {
            cb('There was an error connecting to the game data collection: ');
            return;
        }
        log.info('Got the game data collection.');
        global.mush.data = data;
        cb();
    });
}

/**
 * save the db connection to the global mush object.
 * @param {Function} cb A callback to signal the work is done
 */
function connectToDb(cb) {
    mush_utils.connectToMongoDb(function(err, db) {
        if (err) {
            cb('There was an error connecting to the database.');
            return;
        }
        assert.ok(db !== undefined);
        global.mush.db = db;
        log.info('Connected to DB.');
        cb();
    });
}

/**
 * sets up the global mush object, which has the config and db objects.
 * After this function global.mush will be just mush.
 */
function main() {

    // execute a set of function sequentially, and then execute the callback
    // which is an anonymous function that starts the mush.
    async.series( [
            connectToDb,                // must be first
            getGameDataDb,      // must be second
            getObjectDb,
            getPlayerDb,
        ],

        function(err) {
            if (err) {
                console.error(err);
                return;
            }
            startTheMush();
        }
    );
}
