/**
 * This the file that is run when you want to start mush.js.
 * Here, we set up the database collections and then start the
 * server.
 */
'use strict';           // Forces better usage of JavaScript.
var Config = require('config-js').Config;

// set up some global objects
global.mush = {};
global.mush.config = new Config('../cfg/mush_config.js', 'us');
global.MushUtils = require('./MushUtils');
global.log = MushUtils.createLogger();
global.is = require('is2');
global.util = require('util');
global.assert = require('assert');
require('sprintf.js');   // adds a sprintf in the global-scope and a printf on string objs

var async = require('async');
var PlayerDb = require('./PlayerDb').PlayerDb;
var GameDataDb = require('./GameDataDb').GameDataDb;
var ObjectDb = require('./ObjectDb').ObjectDb;
var Server = require('./Server').Server;

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
 * @param {string} err If defined, there was an error.
 * @param {object} collection A mongodb collection
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
 * @param {string} err If defined, there was an error.
 * @param {object} db A mongodb db object.
 */
function connectToDb(cb) {
    MushUtils.connectToMongoDb(function(err, db) {
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
 * @param {function} cb A callback with 1 param, err, indicating an error
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

        function(err, results) {
            if (err) {
                console.error(err);
                return;
            }
            startTheMush();
        }
    );
}

// This is where everything starts
main();     // we have to a invoke main to get started (barbaric!)
