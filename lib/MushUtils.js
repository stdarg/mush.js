/*!
 * A set of useful functions that didn't belong in any one single location,
 * so they end up here. Think of it as the file of misfit functions.
 */
'use strict';

/**
 * For a given string, create a sha1 hash.
 * @param {string} strIn The input string from which the hash is created
 * @returns {string} The hash is the returned string.
 */
exports.createHash = function(strIn) {
    assert.ok(strIn);
    assert.ok(is.nonEmptyStr(strIn));

    var crypto = require('crypto');
    var hmac = crypto.createHmac('sha1', 'potrzebie');
    hmac.update(strIn);

    var hash = hmac.digest('base64');
    assert.ok(hash);
    assert.ok(is.nonEmptyStr(hash));

    return hash;
};

/**
 * Set up the global logger.
 */
exports.createLogger = function() {

    var Log = require('fuzelog');

    var defaultLogSetup = {
        level: 'info',              // INFO logging level
        name: 'mush.js',            // Category name, shows as %c in pattern

        // FileStream to log to (can be file name or a stream)
        file: __dirname + '/../mush.log',
        fileFlags: 'a',             // Flags used in fs.createWriteStream to create log file

        consoleLogging: true,       // Flag to direct output to console
        colorConsoleLogging: true,  // Flag to color output to console

        // Usage of the log4js layout
        logMessagePattern: '[%d{ISO8601}] [%p] %c - %m{1}'
    };

    var logConfig = global.mush.config.get('logging', defaultLogSetup);
    return new Log(logConfig);
};

/*
exports.makeObjReadOnly = function(obj) {
    assert.ok(is.obj(obj));
    for (var prop in obj) {
        Object.defineProperty(obj, prop, {
            value:          obj[prop],
            writable:       false,
            enumerable:     true,
            configurable:   true
        });
    }
};
*/

/**
 * Recursively make each property in the object and its sub-objects immutable.
 * @param {object} obj An object for which to make immutable properties.
 * TODO: Test with array objects in an object.
 */
exports.makeImmutableRecurse = function(obj) {

    if (typeof obj !== 'object' && !(Array.isArray(obj)))
        return;

    for (var prop in obj) {
        if ((typeof obj === 'object') && !(Array.isArray(obj)))
            exports.makeImmutableRecurse(prop);
        else
            exports.makeImmutable(obj, prop);
    }
};

/**
 * <p>Make a property immutable (assuring it cannot be changed from the current value).</p>
 *
 * <p>
 * This operation cannot be un-done.
 * </p>
 * <p><i>
 *
 * This method was built for disabling runtime changes to configuration values,
 * but it can be applied to <u>any</u> javascript object.
 * </i></p>
 *
 * <p>Example:</p>
 * <pre>
 *   var CONFIG = require('config').customer;
 *   ...
 *
 *   // Obtain a DB connection using CONFIG parameters
 *   database.open(CONFIG.db.name, CONFIG.db.port);
 *   ...
 *
 *   // Don't allow database changes after connect
 *   CONFIG.makeImmutable(CONFIG.db, 'name');
 *   CONFIG.makeImmutable(CONFIG.db, 'port');
 * </pre>
 *
 * @public
 * @param {object} object - The object to attach an immutable property into.
 * @param {string} property - The name of the property to make immutable.
 * @param {mixed} [value] - (optional) Set the property value to this (otherwise leave alone)
 * @returns {object} object - The original object is returned - for chaining.
 */
exports.makeImmutable = function(object, property, value) {

    assert.ok(is.object(object));
    assert.ok(is.nonEmptyStr(property));

    // Use the existing value if a new value isn't specified
    value = (typeof value === 'undefined') ? object[property] : value;

    // Disable writing, and make sure the property cannot be re-configured.
    Object.defineProperty(object, property, {
        value : value,
        writable : false,
        configurable: false
     });

    return object;
};

/**
 * Creartes a connection to mongodb. The connection returns in the callback.
 * @public
 * @param {function} cb The callback that delivers and error or a connection to mongodb.
 */
exports.connectToMongoDb = function(cb) {
    assert.ok(is.func(cb));

    var Db = require('mongodb').Db;
    var Server = require('mongodb').Server;

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
        strict : false
    };

    var dbCfg = global.mush.config.get('mongodb.dbCfg', dbCfg_def);
    assert.ok(is.object(dbCfg));

    var db = new Db(dbName, new Server(dbHost, dbPort, dbCfg, {}), {safe: false});
    assert.ok(db);

    db.open(function(err, db) {
        assert.ok(err || db);
        cb(err, db);
    });
};
