/**
 * @fileOver Here is the Server object which handles all the player connections
 * and the processes the command and output queues.
 */
var net = require('net'),
    util = require('util'),
    assert = require('assert');

var Player = require('./player').Player,
    Connection = require('./connection.js').Connection,
    CommandQueue = require('./command_processing.js').CommandQueue;

exports.Server = Server;

function Server() {
    this.nextConId = 0;
    this.ConnectionList = {};
    this.OutputQue = [];
    this.id = 0;
}

Server.prototype.processCmdQue = function() {
    if (this.OutputQue.length === 0) return;
    var outputEntry = this.OutputQue.pop();

    //console.log('processCmdQue: '+outputEntry.output);
    //console.log('ConnectionList: '+util.inspect(ConnectionList, true, null));

    for (var i in this.ConnectionList) {
        console.log('processCmdQue i: '+i);
        this.ConnectionList[i].socket.write(outputEntry.output);
    }
                
    var self = this;
    if (this.OutputQue.length)
        process.nextTick(function() { self.processCmdQue(); });
};

Server.prototype.queCmdOutput = function(cmdEntry, output) {
    var outputEntry = {};
    outputEntry.cmdEntry = cmdEntry;
    outputEntry.output = output;
    this.OutputQue.push(outputEntry);
    //console.log('queCmdOutput ithis.ConnectionList: '+util.inspect(ithis.ConnectionList));
    var self = this;
    if (this.OutputQue.length === 1)
        process.nextTick( function () { self.processCmdQue(); });
};

Server.prototype.connectionDisconnected = function(conn) {
    console.log('client disconnected');
    delete this.ConnectionList[conn.connectionId];
};

Server.prototype.handleInput = function(conn, data) {
    if (typeof data !== 'string')
        data = data.toString();

    data = data.replace(/[\v\f\n\r\t]+/g,'');  // remove control characters
    CommandQueue().queCmd(conn, data);
    //for (i in ConnectionList) {
        //var buf = conn.player.attribs.name + ' says, "'+data+'"';
        //ConnectionList[i].socket.write(buf);
    //}
};

Server.prototype.start = function() {
    var self = this;

    this.server = net.createServer(function(socket) {
       console.log('client connected');
        socket.write('Welcome to SpaceMud\r\n');
        
        console.log('newCon ConnectionList: '+typeof self.ConnectionList);
        //console.log('newConnection this: '+util.inspect(this));
        self.ConnectionList[self.nextConId] = new Connection(socket, self.nextConId);
        
        for (var i in self.ConnectionList) {
            console.log('ConnectionList: '+i);
        }
        self.nextConId++;
    });

    this.server.listen(4201, function() { //'listening' listener
        console.log('server bound to port 4201');
    });
}
