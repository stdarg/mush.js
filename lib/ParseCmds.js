'use strict';

var util = require('util');
var Commands = require('./Commands').Commands;

exports.ParseCmds = ParseCmds;

// FIXME: From a base list of commands, auto-create the aliases.
// Command Syntax

var cmdTab = {
    connect:    { name: 'connect',  numArgs: 2, func: Commands.prototype.connect  },
    connec:     { name: 'connect',  numArgs: 2, func: Commands.prototype.connect  },
    conne:      { name: 'connect',  numArgs: 2, func: Commands.prototype.connect  },
    conn:       { name: 'connect',  numArgs: 2, func: Commands.prototype.connect  },
    con:        { name: 'connect',  numArgs: 2, func: Commands.prototype.connect  },
    co:         { name: 'connect',  numArgs: 2, func: Commands.prototype.connect  },
    create:     { name: 'create',   numArgs: 2, func: Commands.prototype.create   },
    creat:      { name: 'create',   numArgs: 2, func: Commands.prototype.create   },
    crea:       { name: 'create',   numArgs: 2, func: Commands.prototype.create   },
    cre:        { name: 'create',   numArgs: 2, func: Commands.prototype.create   },
    cr:         { name: 'create',   numArgs: 2, func: Commands.prototype.create   },
    pose:       { name: 'pose',     numArgs: 1, func: Commands.prototype.pose     },
    pos:        { name: 'pose',     numArgs: 1, func: Commands.prototype.pose     },
    po:         { name: 'pose',     numArgs: 1, func: Commands.prototype.pose     },
    p:          { name: 'pose',     numArgs: 1, func: Commands.prototype.pose     },
    say:        { name: 'say',      numArgs: 1, func: Commands.prototype.say      },
    sa:         { name: 'say',      numArgs: 1, func: Commands.prototype.say      },
    s:          { name: 'say',      numArgs: 1, func: Commands.prototype.say      },
    quit:       { name: 'quit',     numArgs: 0, func: Commands.prototype.quit     },
    qui:        { name: 'quit',     numArgs: 0, func: Commands.prototype.quit     },
    qu:         { name: 'quit',     numArgs: 0, func: Commands.prototype.quit     },
    q:          { name: 'quit',     numArgs: 0, func: Commands.prototype.quit     },
    who:        { name: 'who',      numArgs: 0, func: Commands.prototype.who      },
    wh:         { name: 'who',      numArgs: 0, func: Commands.prototype.who      },
    w:          { name: 'who',      numArgs: 0, func: Commands.prototype.who      },
    _error:     { name: '_error',   numArgs: 0, func: Commands.prototype._error   }
};

function ParseCmds() {}

ParseCmds.prototype.parseAtCmds = function(cmdEntry) {
};

function consumeFirstWord(str) {
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

ParseCmds.prototype.parseCommand = function(cmdEntry) {
    var noPrefixSpace = true;
    cmdEntry.cmdStr = cmdEntry.cmd.toString('utf8');
    var index = 0;
    var cmd = undefined;

    // FIXME: add support for switches.
    // FIXME: add arg checking
    // FIXME: add support for arg type-checking

    // Handle 1-char cmds - these are special cases where the first
    // white-space separated token has the command followed by the input
    // with no whitespace separator.
    switch (cmdEntry.cmdStr[0]) {
        case '"':
        case '\'':
            return cmdTab.say;
        case ':':
            cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ':'
            cmdEntry.poseWithSpace = true;
            return cmdTab.pose;
        case ';':
            cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ';'
            cmdEntry.poseWithSpace = false;
            return cmdTab.pose;
    }

    // hash to command
    var cmd = cmdTab[cmdEntry.cmdAry[0]];
    if (!cmd)
        cmd = cmdTab._error;
    return cmd;
};
