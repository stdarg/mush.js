"use strict";
var util = require('util');
var Commands = require('./Commands').Commands;
var Parser = require('./ParseCmds').ParseCmds;

exports.CmdQueue = CmdQueue;

function CmdQueue() {
    this.cmdQueue = [];     // a queue of commands to be run
    this.Commands = new Commands();
};

// private methods
CmdQueue.prototype.processQue = function() {
    if (this.cmdQueue.length === 0)
        return;

    var cmdEntry = this.cmdQueue.pop();
    var cmd = Parser.prototype.parseCommand(cmdEntry);

    if (!cmd) {
        console.error('Error on: '+util.inspect(cmdEntry));
        return;
    }

    cmd.func(cmdEntry);
    var self = this;

    if (this.cmdQueue.length)
        process.nextTick(function() {self.processQue();});
};

CmdQueue.prototype.queCmd = function(conn, cmd) {
    var cmdEntry = {};
    cmdEntry.conn = conn;
    cmdEntry.cmd = cmd;
    cmdEntry.cmdAry = cmd.split(/\s+/); // split by ws for parsing.
    this.cmdQueue.push(cmdEntry);
 
    var self = this;
    if (this.cmdQueue.length)
        process.nextTick(function() {self.processQue();});
};
