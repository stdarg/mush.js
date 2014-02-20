/**
 * @fileOverview
 * This file sets up the global environment.
 */

'use strict';           // Forces better usage of JavaScript.
var Config = require('config-js');
var path = require('path');
require('sprintf.js');   // adds a sprintf in the global-scope and a printf on string objs

module.exports = setGlobalEnv;

/**
 * save the db connection to the global mush object.
 * @param {Function} cb A callback to signal the work is done
 */
function connectToDb(cb) {
    var pathToDb = path.join(__dirname, '..', 'db');
    var Db = require('./db');
    new Db(pathToDb, function(err, db) {
        if (err)  return cb(err);
        assert.ok(is.nonEmptyObj(db));
        global.mush.db = db;
        global.validId = mush.db.validId;
        if (cb)
            cb();
    });
}

function setGlobalEnv(cb) {

    // set up some global objects
    global.mush = {};

    // create the global config object
    var configFilePath = path.join(__dirname, '../cfg/mush_config_##.js');
    global.mush.config = new Config(configFilePath, 'us');

    global.util = require('util');
    global.inspect = global.util.inspect;
    global.assert = require('assert');
    global.mush_utils = require('./mush_utils');
    global.mush.utils = require('./mush_utils');
    global.mush.Factory = require('./factory')();
    global.log = mush_utils.createLogger();
    global.is = require('is2');
    global.mush.PlayerDir = require('./player_dir')();
    connectToDb(cb);
}

