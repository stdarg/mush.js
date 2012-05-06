'use strict';
var util = require('util');
var ObjectProvider = require('./Db').ObjectProvider;
var Server = require('./Server').Server;

global.PlayerDb = new ObjectProvider('127.0.0.1', 27017, function(err) {
    if (err) {
        console.error('There was an error connecting with the player collection.');
        process.exit(1);
        return;
    }
    console.log('Connected to player collection.');
    console.log('Starting server.');
    global.SpaceMud = new Server();
    global.SpaceMud.start();
});

