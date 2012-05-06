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
    global.PlayerDb.findByName(playerName, function(err, player) {
        if (err) {
            console.error('Error: '+err);
            return;
        }

        if (!player || player.pass !== password) {
            cmdEntry.conn.socket.write('Either the password is incorrect or there is no player with that name.\n');
            return;
        }

        cmdEntry.conn.player.updateWithDbObj(player);
        global.mush.queCmdOutput(cmdEntry, player.name+' has connected.');
    });
};

Commands.prototype.create = function(cmdEntry) {
    if (cmdEntry.cmdAry.length < 3) {
        console.error('Insufficient arguments for command connect');
        return;
    }
        
    var playerName = cmdEntry.cmdAry[1];
    var password = cmdEntry.cmdAry[2];

    global.PlayerDb.findByName(playerName, function(err, player) {
        if (err) {
            console.error('Error: '+err);
            return;
        }
        if (player) {
            cmdEntry.conn.socket.write('There is already a player named "'+player.name+
                                       '". Please choose another name.\n');
            return;
        }
        global.PlayerDb.createPlayer(playerName, password, function(err, newPlayer) {
            if (err) {
                console.error('Error: '+err);
                return;
            }
            cmdEntry.conn.player.updateWithDbObj(newPlayer);
            global.mush.queCmdOutput(cmdEntry, newPlayer.name+' has connected.');
        });
    });
};

Commands.prototype.pose = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + 
        (cmdEntry.poseWithSpace ? ' ' : '') + cmdEntry.cmdStr;
    global.mush.queCmdOutput(cmdEntry, output);
};

Commands.prototype.say = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + ' says "' + cmdEntry.cmdStr + '"';
    global.mush.queCmdOutput(cmdEntry, output);
};

Commands.prototype.quit = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + ' has logged out.';
    global.mush.queCmdOutput(cmdEntry, output);
    cmdEntry.conn.socket.end();
};

Commands.prototype.who = function(cmdEntry) {
    var output = 'Players currently online:\n';
    for (conn in global.mush.ConnectionList) {
        output += util.format('%s %d sec\n', 
                              global.mush.ConnectionList[conn].player.name,
                              global.mush.ConnectionList[conn].timeOnlineSecs());
    }
    cmdEntry.conn.socket.write(output);
};
