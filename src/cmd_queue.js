/**
 * @fileOverview
 * The CmdQueue object is a queue of all user commands to be exectued. The commands
 * are parsed and executed in _processQueue where 1 command is handled per tick.
 * FIXME: Make the number of commands executed on a pass configurable.
 */

'use strict';
exports.CmdQueue = CmdQueue;

var Commands = require('./commands').Commands;
var Parser = require('./parse_cmd').ParseCmd;

/**
 * The CmdQueue object constructor. It create the queue, an array object, and instantiates a
 * Command object and a Parser object.
 * @constructor
 */
function CmdQueue() {
    this.cmdQueue = [];     // a queue of commands to be run
    this.Commands = new Commands();
    this.Parser = new Parser();
}

/**
 * _processQueue parses and executes a single command on every tick,
 * and if commands are still in the queue, sets itself up to execute
 * on the next tick.
 * @private
 */
CmdQueue.prototype._processQue = function() {
    if (this.cmdQueue.length === 0)
        return;
    assert.ok(is.obj(this.Parser));
    assert.ok(is.array(this.cmdQueue));

    var cmdEntry = this.cmdQueue.pop();
    assert.ok(is.obj(cmdEntry));
    assert.ok(is.obj(cmdEntry.conn));
    var cmd = this.Parser.parseCommand(cmdEntry);

    if (!cmd) {
        log.error('CmdQueue._processQue: Error on: %j', cmdEntry);
        return;
    }

    // FIXME: Need to figure how to eval
    // Also need to implement a stack
    /*
    var dbref;
    cmdEntry.cmdArySubst = [];
    // look for arguments, e.g. here, me and convert them to db refs
    // skip the first arg, because that is the command (may change later)
    for (var i=1; i<cmdEntry.cmdAry.length; ++i) {
        switch (cmdEntry.cmdAry[i]) {
        case 'here':
            dbref = cmdEntry.conn.player.loc;
            cmdEntry.cmdArySubst[i] = deref;
            break;
        case 'me':
            dbref = cmdEntry.conn.player.id;
            cmdEntry.cmdArySubst[i] = dbref;
            break;
        case '%s':
            if (cmdEntry.conn.player.sex === 'male')
                cmdEntry.cmdArySubst[i] = 'he';
            else if (cmdEntry.conn.player.sex === 'female')
                cmdEntry.cmdArySubst[i] = 'she';
            else
                cmdEntry.cmdArySubst[i] = 'it';
            break;
        case '%o':
            if (cmdEntry.conn.player.sex === 'male')
                cmdEntry.cmdArySubst[i] = 'him';
            else if (cmdEntry.conn.player.sex === 'female')
                cmdEntry.cmdArySubst[i] = 'her';
            else
                cmdEntry.cmdArySubst[i] = 'it';
            break;
        case '%p':
            if (cmdEntry.conn.player.sex === 'male')
                cmdEntry.cmdArySubst[i] = 'his';
            else if (cmdEntry.conn.player.sex === 'female')
                cmdEntry.cmdArySubst[i] = 'hers';
            else
                cmdEntry.cmdArySubst[i] = 'its';
            break;
        case '%#':
        case '%0':
        }
    }
    */

    cmd.func(cmdEntry);
    var self = this;

    if (this.cmdQueue.length)
        process.nextTick(function() {self._processQue();});
};

/**
 * queCmd allows objects to place commands on the queue to be
 * executed in a FIFO order. It creates a command entry object based
 * on the input parameters.
 * @param {object} conn An object describing the player's connection.
 * @param {string} cmdStr A string of the user input.
 */
CmdQueue.prototype.queCmd = function(conn, cmdStr) {
    assert.ok(is.object(conn));
    assert.ok(is.nonEmptyStr(cmdStr));

    var cmdEntry = {};
    cmdEntry.conn = conn;                       // player connection
    cmdEntry.origCmdStr = String(cmdStr);       // original string for error messages
    cmdEntry.cmdStr = cmdStr;                   // string to be consumed by parser
    cmdEntry.cmdAry = cmdStr.split(/\s+/);      // split for easy access to parameters
    this.cmdQueue.push(cmdEntry);

    // The text below has a bug, resulting in _processQue getting called
    // extra times. Will fix later.
    var self = this;
    if (this.cmdQueue.length)
        process.nextTick(function() {self._processQue();});
};
