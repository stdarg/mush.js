'use strict';

var util = require('util');
var assert = require('assert');

var Commands = require('./Commands').Commands;
var is = require('./is');

exports.ParseCmds = ParseCmds;

// FIXME: From a base list of commands, auto-create the aliases.
// Command Syntax

var cmdTab = {
    connect:    { name: 'connect',  numArgs: 2, func: Commands.prototype.connect, conPlayer: false, dconPlayer: true  },
    connec:     { name: 'connect',  numArgs: 2, func: Commands.prototype.connect, conPlayer: false, dconPlayer: true  },
    conne:      { name: 'connect',  numArgs: 2, func: Commands.prototype.connect, conPlayer: false, dconPlayer: true  },
    conn:       { name: 'connect',  numArgs: 2, func: Commands.prototype.connect, conPlayer: false, dconPlayer: true  },
    con:        { name: 'connect',  numArgs: 2, func: Commands.prototype.connect, conPlayer: false, dconPlayer: true  },
    co:         { name: 'connect',  numArgs: 2, func: Commands.prototype.connect, conPlayer: false, dconPlayer: true  },
    create:     { name: 'create',   numArgs: 2, func: Commands.prototype.create,  conPlayer: false, dconPlayer: true  },
    creat:      { name: 'create',   numArgs: 2, func: Commands.prototype.create,  conPlayer: false, dconPlayer: true  },
    crea:       { name: 'create',   numArgs: 2, func: Commands.prototype.create,  conPlayer: false, dconPlayer: true  },
    cre:        { name: 'create',   numArgs: 2, func: Commands.prototype.create,  conPlayer: false, dconPlayer: true  },
    cr:         { name: 'create',   numArgs: 2, func: Commands.prototype.create,  conPlayer: false, dconPlayer: true  },
    pose:       { name: 'pose',     numArgs: 1, func: Commands.prototype.pose,    conPlayer: true,  dconPlayer: false },
    pos:        { name: 'pose',     numArgs: 1, func: Commands.prototype.pose,    conPlayer: true,  dconPlayer: false },
    po:         { name: 'pose',     numArgs: 1, func: Commands.prototype.pose,    conPlayer: true,  dconPlayer: false },
    p:          { name: 'pose',     numArgs: 1, func: Commands.prototype.pose,    conPlayer: true,  dconPlayer: false },
    say:        { name: 'say',      numArgs: 1, func: Commands.prototype.say,     conPlayer: true,  dconPlayer: false },
    sa:         { name: 'say',      numArgs: 1, func: Commands.prototype.say,     conPlayer: true,  dconPlayer: false },
    s:          { name: 'say',      numArgs: 1, func: Commands.prototype.say,     conPlayer: true,  dconPlayer: false },
    quit:       { name: 'quit',     numArgs: 0, func: Commands.prototype.quit,    conPlayer: true,  dconPlayer: true  },
    qui:        { name: 'quit',     numArgs: 0, func: Commands.prototype.quit,    conPlayer: true,  dconPlayer: true  },
    qu:         { name: 'quit',     numArgs: 0, func: Commands.prototype.quit,    conPlayer: true,  dconPlayer: true  },
    q:          { name: 'quit',     numArgs: 0, func: Commands.prototype.quit,    conPlayer: true,  dconPlayer: true  },
    who:        { name: 'who',      numArgs: 0, func: Commands.prototype.who,     conPlayer: true,  dconPlayer: true  },
    wh:         { name: 'who',      numArgs: 0, func: Commands.prototype.who,     conPlayer: true,  dconPlayer: true  },
    w:          { name: 'who',      numArgs: 0, func: Commands.prototype.who,     conPlayer: true,  dconPlayer: true  },
    _error:     { name: '_error',   numArgs: 0, func: Commands.prototype._error,  conPlayer: true,  dconPlayer: true  }
};

function ParseCmds() {}

ParseCmds.prototype.parseAtCmds = function(cmdEntry) { };

ParseCmds.prototype.parseCommand = function(cmdEntry) {
    var noPrefixSpace = true;
    cmdEntry.cmdStr = cmdEntry.cmd.toString('utf8');
    var index = 0;
    var cmd = undefined;
    var shortCmd = false;

    //console.log('cmdEntry: '+util.inspect(cmdEntry));

    // FIXME: add support for switches.
    // FIXME: add arg checking
    // FIXME: add support for arg type-checking

    // Handle 1-char cmds - these are special cases where the first
    // white-space separated token has the command followed by the input
    // with no whitespace separator.
    switch (cmdEntry.cmdStr[0]) {
        case '"':
        case '\'':
            cmd = cmdTab.say;
            shortCmd = true;
            break;
        case ':':
        case ';':
            cmd = cmdTab.pose;
            shortCmd = true;
            break;
    }

    // hash to command
    if (!cmd)
        cmd = cmdTab[cmdEntry.cmdAry[0]];

    // ensure cmd is valid for this player
    if (cmd && cmdIsValid(cmd, cmdEntry)) {
        if (!shortCmd)
            cmdEntry.cmdStr = consumeFirstWordAndWhiteSpace(cmdEntry.cmdStr);
    } else {
        cmd = cmdTab._error;
    }

    return cmd;
};

function cmdIsValid(cmd, cmdEntry) {
    if (cmdEntry.conn.player.isConnected() && cmd.conPlayer === false)
        return false;

    if (cmdEntry.conn.player.isDisconnected() && cmd.dconPlayer === false)
        return false;

    return true;
}

function consumeFirstWordAndWhiteSpace(str) {
    if (!str)
        return;

    // skip over non-white spave
    var i = 0;
    for (; i<str.length; i++) {
        if (' \t\n\r\v\f'.indexOf(str.charAt(i)) !== -1)
            break;
    }

    // we are now on ws, skip it
    for (; i<str.length; i++) {
        if (' \t\n\r\v\f'.indexOf(str.charAt(i)) === -1)
            break;
    }

    var rstr = str.substring(i);
    return rstr;
}
