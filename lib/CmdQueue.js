"use strict";
var util = require('util');
var assert = require('assert');

var is = require('./is');
var Commands = require('./Commands').Commands;
var Parser = require('./ParseCmds').ParseCmds;

exports.CmdQueue = CmdQueue;

function CmdQueue() {
    this.cmdQueue = [];     // a queue of commands to be run
    this.Commands = new Commands();
    this.Parser = new Parser();
};

// private methods
CmdQueue.prototype.processQue = function() {
    if (this.cmdQueue.length === 0)
        return;
    assert.ok(is.obj(this.Parser));
    assert.ok(is.array(this.cmdQueue));

    var cmdEntry = this.cmdQueue.pop();
    var cmd = this.Parser.parseCommand(cmdEntry);

    if (!cmd) {
        console.error('Error on: '+util.inspect(cmdEntry));
        return;
    }

    cmd.func(cmdEntry);
    var self = this;

    if (this.cmdQueue.length)
        process.nextTick(function() {self.processQue();});
};

CmdQueue.prototype.queCmd = function(conn, cmdStr) {
    assert.ok(is.object(conn));
    assert.ok(is.nonEmptyStr(cmdStr));

    var cmdEntry = {};
    cmdEntry.conn = conn;
    cmdEntry.cmd = cmdStr;
    cmdEntry.cmdAry = cmdStr.split(/\s+/); // split by ws for parsing.
    this.cmdQueue.push(cmdEntry);
 
    var self = this;
    if (this.cmdQueue.length)
        process.nextTick(function() {self.processQue();});
};
