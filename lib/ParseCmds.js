var util = require('util');
var Commands = require('./Commands').Commands;

console.log('Commands: '+util.inspect(Commands));

exports.ParseCmds = ParseCmds;

// Command Syntax

var cmdTab = {
    pose:       { name: 'pose',     numArgs: 1, func: Commands.prototype.pose     },
    say:        { name: 'say',      numArgs: 1, func: Commands.prototype.say      },
    connect:    { name: 'connect',  numArgs: 2, func: Commands.prototype.connect  },
    create:     { name: 'create',   numArgs: 2, func: Commands.prototype.create   },
    quit:       { name: 'quit',     numArgs: 0, func: Commands.prototype.quit     },
    who:        { name: 'who',      numArgs: 0, func: Commands.prototype.who      },
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

    switch (cmdEntry.cmdStr[0]) {
        case '"':
        case '\'':
            cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove '"' or '\''
            return cmdTab.say;
        case ':':
            cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ':'
            cmdEntry.poseWithSpace = true;
            return cmdTab.pose;
        case ';':
            cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ';'
            cmdEntry.poseWithSpace = false;
            return cmdTab.pose;
        case 'co':
        case 'con':
        case 'conn':
        case 'conne':
        case 'connec':
        case 'connect':
            return cmdTab.conect;
        case 'cr':
        case 'cre':
        case 'crea':
        case 'creat':
        case 'create':
            return cmdTab.create;
        case 'p':
        case 'po':
        case 'pos':
        case 'pose':
            cmdEntry.poseWithSpace = true;
            cmdEntry.cmdStr = consumeFirstWord(cmdEntry.cmdStr);
            return cmdTab.pose;
        case 'q':
        case 'qu':
        case 'qui':
        case 'quit':
            return cmdTab.quit;
        case 's':
        case 'sa':
        case 'say':
            cmdEntry.cmdStr = consumeFirstWord(cmdEntry.cmdStr);
            return cmdTab.say;
        case 'w':
        case 'wh':
        case 'who':
            return cmdTab.who;
        default:
            return cmdTab._error;
    }
};
