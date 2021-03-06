/**
 * @fileOverview Here is the Server object which handles all the player connections
 * and the processes the command and output queues.
 */
'use strict';
exports.Server = Server;

var net = require('net');
var Connection = require('./connection').Connection;
var CmdQueue = require('./cmd_queue').CmdQueue;

/**
 * The Server object manages the listening socket and processes new connections and
 * disconnections.
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
 */
Server.prototype.processCmdQueue = function() {
    if (this.OutputQue.length === 0) return;
    var outputEntry = this.OutputQue.pop();

    for (var i in this.ConnectionList)
        this.ConnectionList[i].socket.write(outputEntry.output);

    var self = this;
    if (this.OutputQue.length)
        process.nextTick(function() {self.processCmdQueue();});
};

/**
 * Method to submit a the output from a player command into a queue.
 * @param {object} cmdEntry An object with the command and all the context to execute the
 * command.
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
        process.nextTick(function() {self.processCmdQueue();});
};

/**
 * Handle client disconnects.
 * @param {Object} conn The connection to the player.
 */
Server.prototype.connectionDisconnected = function(conn) {
    log.info('A client disconnected.');
    delete this.ConnectionList[conn.connectionId];
};

/**
 * Handle input from clients.
 * @param {Object} conn The connection to the player.
 * @param {String} data Text input from the player.
 */
Server.prototype.handleInput = function(conn, data) {
    if (typeof data !== 'string')
        data = data.toString();

    data = data.replace(/[\v\f\n\r\t]+/g,'');  // remove control characters
    data = data.replace(/^\s*/, '').replace(/\s*$/, '');  // remove leading & trailing ws

    if (is.nonEmptyStr(data))
        this.CmdQueue.queCmd(conn, data);
};

/**
 * The start method sets up the listening socket and enables connections to occur.
 */
Server.prototype.start = function() {
    var self = this;

    function handleConnection(socket) {
        log.info('A client connected.');
        socket.write('Welcome to mush.js.\r\n');

        self.ConnectionList[self.nextConId] = new Connection(socket, self,
                                                             self.nextConId);
        self.nextConId++;
    }

    this.server = net.createServer(handleConnection);

    var port = global.mush.config.get('server.port', 4201);
    this.server.listen(port, function() { //'listening' listener
        log.info('The server is listening on port %d.', port);
    });
};
