"use strict";
var util = require('util');
exports.Commands = Commands;

function Commands() {}

Commands.prototype.isValidCmd = function(cmd) {
    if (this.table[cmd] === undefined)
        return false;
    return true;
};

Commands.prototype._error = function(cmdEntry) {
    var output = '"'+cmdEntry.cmdStr+'" is not a valid command.' ;
    cmdEntry.conn.socket.write(output);
};

Commands.prototype.connect = function(cmdEntry) {
    if (cmdEntry.cmdAry.length < 3) {
        console.error('Insufficient arguments for command connect.');
        return;
    }
        
    var playerName = cmdEntry.cmdAry[1];
    var password = cmdEntry.cmdAry[2];
    global.mush.db.players.findByName(playerName, function(err, player) {
        if (err) {
            console.error('Error: '+err);
            return;
        }

        if (!player || player.pass !== password) {
            cmdEntry.conn.socket.write('Either the password is incorrect or there is no player with that name.\n');
            return;
        }

        cmdEntry.conn.player.updateWithDbObj(player);
        global.mush.Server.queCmdOutput(cmdEntry, player.name+' has connected.');
    });
};

Commands.prototype.create = function(cmdEntry) {
    if (cmdEntry.cmdAry.length < 3) {
        console.error('Insufficient arguments for command connect');
        return;
    }
        
    var playerName = cmdEntry.cmdAry[1];
    var password = cmdEntry.cmdAry[2];

    global.mush.db.players.findByName(playerName, function(err, player) {
        if (err) {
            console.error('Error: '+err);
            return;
        }
        if (player) {
            cmdEntry.conn.socket.write('There is already a player named "'+player.name+
                                       '". Please choose another name.\n');
            return;
        }
        global.mush.db.players.createPlayer(playerName, password, function(err, newPlayer) {
            if (err) {
                console.error('Error: '+err);
                return;
            }
            cmdEntry.conn.player.updateWithDbObj(newPlayer);
            global.mush.Server.queCmdOutput(cmdEntry, newPlayer.name+' has connected.');
        });
    });
};

Commands.prototype.pose = function(cmdEntry) {
    var poseWithSpace = true;

    // how did we arrive here, with what form of pose?
    // need to handle ':', ';' but not pose.
    if (cmdEntry.cmdStr[0] === ':') {
        cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ':'
    } else if (cmdEntry.cmdStr[0] === ';') {
        poseWithSpace = false;
        cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ';'
    }

    var output = cmdEntry.conn.player.name + 
        (poseWithSpace ? ' ' : '') + cmdEntry.cmdStr;
    global.mush.Server.queCmdOutput(cmdEntry, output);
};

Commands.prototype.say = function(cmdEntry) {

    // how did we arrive here, with what form of pose?
    // need to handle ", ' but not say.
    if (cmdEntry.cmdStr[0] === '\'') {
        cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove '
    } else if (cmdEntry.cmdStr[0] === '"') {
        cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove "
    }

    var output = cmdEntry.conn.player.name + ' says "' + cmdEntry.cmdStr + '"';
    global.mush.Server.queCmdOutput(cmdEntry, output);
};

Commands.prototype.quit = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + ' has logged out.';
    global.mush.Server.queCmdOutput(cmdEntry, output);
    cmdEntry.conn.socket.end();
};

Commands.prototype.who = function(cmdEntry) {
    var output = 'Players currently online:\n';
    for (conn in global.mush.Server.ConnectionList) {
        output += util.format('%s %d sec\n', 
                              global.mush.Server.ConnectionList[conn].player.name,
                              global.mush.Server.ConnectionList[conn].timeOnlineSecs());
    }
    cmdEntry.conn.socket.write(output);
};
