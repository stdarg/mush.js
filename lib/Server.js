/**
 * @fileOver Here is the Server object which handles all the player connections
 * and the processes the command and output queues.
 */
'use strict';

var net = require('net');
var util = require('util');
var assert = require('assert');
var Player = require('./Player').Player;
var Connection = require('./Connection').Connection;
var CmdQueue = require('./CmdQueue').CmdQueue;
var is = require('is2');

exports.Server = Server;

/**
 * The Server object manages the listening socket and processes new connections and disconnections.
 * @constructor
 */
function Server() {
    this.nextConId = 0;
    this.ConnectionList = {};
    this.OutputQue = [];
    this.id = 0;
    this.CmdQueue = new CmdQueue();
}

/**
 * Handles the player commands in the queue 1-per-process tick.
 * @private
 */
Server.prototype._processCmdQueue = function() {
    if (this.OutputQue.length === 0) return;
    var outputEntry = this.OutputQue.pop();

    for (var i in this.ConnectionList) {
        this.ConnectionList[i].socket.write(outputEntry.output);
    }

    var self = this;
    if (this.OutputQue.length)
        process.nextTick(function() {self._processCmdQueue();});
};

/**
 * Method to submit a the output from a player command into a queue.
 * @public
 * @param {object} cmdEntry An object with the command and all the context to execute the command.
 * @param {string} output The output of the command to be sent to players.
 */
Server.prototype.queCmdOutput = function(cmdEntry, output) {
    assert(is.nonEmptyStr(output));
    if (output.charAt(output.length-1) !== '\n')
        output += '\n';
    var outputEntry = {};
    outputEntry.cmdEntry = cmdEntry;
    outputEntry.output = output;
    this.OutputQue.push(outputEntry);

    var self = this;
    if (this.OutputQue.length === 1)
        process.nextTick(function() {self._processCmdQueue();});
};

/**
 * Handle client disconnects.
 * @private
 */
Server.prototype.connectionDisconnected =
Server.prototype._connectionDisconnected = function(conn) {
    console.log('A client disconnected.');
    delete this.ConnectionList[conn.connectionId];
};

/**
 * Handle input from clients.
 * @private
 */
Server.prototype.handleInput =
Server.prototype._handleInput = function(conn, data) {
    if (typeof data !== 'string')
        data = data.toString();

    data = data.replace(/[\v\f\n\r\t]+/g,'');  // remove control characters
    data = data.replace(/^\s*/, '').replace(/\s*$/, '');  // remove leading & trailing ws

    console.log('Data received: '+data);

    if (is.nonEmptyStr(data))
        this.CmdQueue.queCmd(conn, data);
};

/**
 * The start method sets up the listening socket and enables connections to occur.
 * @public
 */
Server.prototype.start = function() {
    var self = this;

    this.server = net.createServer(function(socket) {
        console.log('A client connected.');
        socket.write('Welcome to mush.js.\r\n');

        self.ConnectionList[self.nextConId] = new Connection(socket, self.nextConId);
        self.nextConId++;
    });

    var port = global.mush.config.get('server.port', 4201);
    this.server.listen(port, function() { //'listening' listener
        console.log('The server is listening to port '+port+'.');
    });
};
