/**
 * This the file that is run when you want to start mush.js.
 * Here, we set up the database collections and then start the
 * server.
 */

'use strict';   // Forces better usage of JavaScript.

var util = require('util');
var assert = require('assert');
var async = require('async');
var ObjectProvider = require('./Db').ObjectProvider;
var Server = require('./Server').Server;
var Config = require('./Config').Config;

// set up some global objects
global.mush = {};
global.mush.db = {};
global.mush.config = new Config('../cfg/mush_config.js', 'us');

// default set of db collections
var collections_def = {
    players : 'players',
    rooms : 'rooms',
    exits : 'exits',
    objects : 'objects',
};

// get the array of the mongo collections
var collections = global.mush.config.get('mongodb.collections', collections_def);
assert.ok(typeof collections === 'object');

// A helper function that uses a closure to bind the name to the function we want to perform.
// If you are new to JavaScript the next few lines will make your head spin.
// Basically, we're using a closure to bind the parameter to the anonymous function
// that is returned. We cannot just pass a sub-scripted array ref, as you might in C or Java
// due to the way closures works. For more info, see: 
// http://stackoverflow.com/questions/6728653/javascipt-closure-binding-value-instead-of-reference
//
var helper = function(name) {
    return function(cb) {
        global.mush.db[name] = new ObjectProvider(name, function(err) {
            if (err) {
                cb('There was an error connecting with the player collection.');
                return;
            }
            //console.log('The server connected to db collection for: '+name);
            cb();
        });
    }
};

// place the anonymous functions returned by the helper into an array for use
// with async
var funcArray = [];
for (var property in collections) {
    funcArray.push(helper(collections[property]));
}

// now use async to init all the object collections at once
// and run the callback when they all complete
async.parallel(funcArray, function(err, results) {
    // was there an error setting up any of the collections?
    if (err) {
        console.error('There was an error connecting to a database collection.');
        process.exit(1);
    }

    // at this point, all db collections are ready!
    console.log('Starting server.');
    global.mush.Server = new Server();
    global.mush.Server.start();
});
