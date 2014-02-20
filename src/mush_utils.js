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
 * Create an independent clone of the object without any references.
 * @param {Object} obj The object to clone.
 * @return {Object} An independent copy of the object without references.
 */
exports.clone = function(obj) {
    log.warn('typeof obj: '+typeof obj);
    log.warn('clone obj: '+util.inspect(obj));
    assert.ok(is.obj(obj));
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Set up the global log.
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

/**
 * isspace(str|ch) - returns true if any character received is a space
 * @param {String} ch - Could be a character or many characters
 * @return {Boolena} true if any character is a space, false otherwise
 */
exports.isspace = function(ch) {
    if (' \t\n\r\v'.indexOf(ch) > -1)
        return true;
    return false;
};

/*
    %r      = Carriage return / newline.
    %t      = Tab character.
    %b      = A single blank space.
    %%      = The literal '%' character.
    %\      = The literal '\' character.

    %#      = Enactor's dbref.
    %n, %N  = Enactor's name. Equiv: name(%#)
    %s, %S  = Subjective pronoun: he, she, it, they. Equiv: subj(%#)
    %o, %O  = Objective pronoun: him, her, it, them. Equiv: obj(%#)
    %p, %P  = Possessive pronoun: his, her, its, their. Equiv: poss(%#)
    %a, %A  = Absolute possessive pronoun: his, hers, its, theirs.
    %l      = Dbref of enactor's location. Equiv: loc(%#)

    %!       = Dbref of the object holding the message or running the
               action list ('me').
    %@       = Dbref of the caller. Except in u()-type functions, same as %#.
    %0-%9    = Value of positional parameter/stack location 0 through 9.
    %+       = Number of positional parameters.
    %q0-%qz  = Value of registers 0-9 and A-Z. Equiv: r(0) - r(z)
    %q<var>  = The <angle brackets> are literal. Named register. Equiv: r(var)
    %va-%vz  = Contents of attributes VA through VZ. Equiv: v(va) - v(vz)
    %=<var>  = The <angle brackets> are literal. Contents of an attribute.
               Equiv: v(<var>) (no <>), i.e., %=<test> is equivalent to
               v(test) or get(me/test)
    %_<var>  = Value of a variable set via setx(). Equiv: x(<var>)
               Normally, this is a single-letter variable name, but if
               the name is enclosed in angle brackets, multi-letter variable
               names can be used. '%_<foo>' is equivalent to 'x(foo)'.
    %x<code> = ANSI color substitution.
    %i0-%i9  = %i-0 to %i-9 are equivalent to itext(sub(ilev(),<num>)).
    %i-<num> = Equivalent to itext(0) - itext(9).
    %j0-%j9  = %j-0 to %j-9 are equivalent to itext2(sub(ilev(),<num>)).
    %j-<num> = Equivalent to itext2(0) - itext2(9).
    %m       = Text of the last command executed.
    %c       = Depending on configuration, equivalent to either %m or %x.

  Note: %<whatever> is equivalent to [v(<whatever>)], but is more efficient.
  Note: Valid genders: male, female, neuter, plural
*/

exports.handleSubst = function(enactor, actor, text) {
    var i = 0;
    //while (' \t\n\r\v'.indexOf(text[i])) i++;
    if (text === 'me') {
        return actor.id;
    } else if (text === 'here') {
        return actor.location;
    } else if (text === 'home') {
        return actor.home;
    } else if (text[i] === '%') {
        i++;
        if (text[i] >= '0' && text[i] <= '9') {
            // grab value from stack
            return;
        }
        switch(text[i]) {
        case '%':   // percent
        case '\\':  // literal /
        case '@':   // dbref of caller
        case '_':   // %_foo == x(foo)
        case '=':   // %=<var>  = The <angle brackets> are literal. Contents of an attribute. (no eval)
        case 'a':   // absolute possessive: his, hers, its, theirs
        case 'A':
        case 'c':   // either %m or %x
        case 's':   // subjective he, she, it, they
        case 'S':
        case 'p':   // possesive his, her, its, their.
        case 'p':
        case 'o':
        case 'O':   // objective him, her, it, them
        case 'm':   // text of last command executed
        case 'n':   // name
        case 'N':   // name
        case 'l':   // location
        case 'r':   // CR
        case 'b':   // space
        case '#':   // dbref
        case '#':   // dbref of enactor
        case '!':   // dbref of actor
        case 'q':   // temp command registers [0-9]
        case 'Q':   // temp command registers [0-9]
        case 'i':   // temp command registers [0-9]
        case 'I':   // temp command registers [0-9]
        case 'v':   // obj reference [a-z]
        case 'w':   // obj reference [a-z]
        case 'x':   // ansi code [0-255]


        }
    } else if (text[i] === '#') {
        i++;
        switch(text[i]) {
        }
    }

};

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

/**
 * Display an error in the best way possible.
 * @param {Error} An error object.
 */
exports.logErr = function(err, msg) {
    if (is.undef(err))
        err = new Error('mush_util.logErr received undefined error');
    if (err.stack)
        log.error('%s: %s', msg, err.stack);
    else if (err.message)
        log.error('%s: %s', msg, err.message);
    else
        log.error('%s: %s', msg, err);
};

exports.isValidId = function(id) {
    if (!is.int(id))  return false;
    if (id < 0)  return false;
    return true;
};

/**
 * Returns true if a valid id.
 * @return {Boolean} true, if a valid id.
 */
exports.validId = function(id) {
    if (!is.nonEmptyStr(id))
        return false;
    var num = parseInt(id, 10);
    if (isNaN(num) || num < -1)
        return false;
    return true;
};
