/**
 * @fileOverview
 * This the file that is run when you want to start mush.js.
 * Here, we set up the database collections and then start the
 * server.
 */
'use strict';           // Forces better usage of JavaScript.
var async = require('async');
var Server = require('./server').Server;

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
 *
 */
function createTheVoid(cb) {
    var theVoid = {
        id: mush.db.getNextId(),
        name: 'The Void',
        type: 'r',
        flags: 0,
        desc: 'You stand at the precipice of creation upon an '+
              'intersection of countless possibilities.',
        owner: '1',
        CREATED: Date.now()
    };
    mush.db.put(theVoid, function(err) {
        if (err)  mush_utils.logErr(err);
        cb(err);
    });
}

/**
 *
 */
function createGod(cb) {
    var god = {
        id: mush.db.getNextId(),
        name: 'God',
        type: 'p',
        flags: 0,
        desc: 'You see an embodiment of the cosmos.',
        owner: '1',
        CREATED: Date.now(),
        loc: '0',
        hash: mush_utils.createHash('potrzebie')
    };
    var PlayerType = require('./player');
    var player = new PlayerType(god);
    assert.ok(player instanceof PlayerType);
    player.saveToDb(cb);
    /*
    mush.db.put(god, function(err) {
        if (err)  mush_utils.logErr(err);
        cb(err);
    });
    */
}

/**
 *
 */
function seedDb(cb) {
    if (!mush.db.isEmpty())  return cb();

    async.parallel([
            createTheVoid,
            createGod
        ],
        function(err) {
            if (err) {
                console.error(err);
                process.exit(2);
                return;
            }
            cb();
        }
    );

}

/**
 * sets up the global mush object, which has the config and db objects.
 * After this function global.mush will be just mush.
 */
function main() {

    // execute a set of function sequentially, and then execute the callback
    // which is an anonymous function that starts the mush.
    async.series([
            seedDb
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

module.exports = { main: main };
