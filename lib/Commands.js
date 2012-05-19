'use strict';

var assert = require('assert');
var is = require('./is');
var util = require('util');
var crypto = require('crypto');
exports.Commands = Commands;

function Commands() {}

Commands.prototype.isValidCmd = function(cmd) {
    assert.ok(is.nonEmptyStr(cmd));
    if (this.table[cmd] === undefined)
        return false;
    return true;
};

Commands.prototype._error = function(cmdEntry) {
    assert.ok(is.object(cmdEntry));
    assert.ok(is.nonEmptyStr(cmdEntry.cmdStr));
    var output = '"'+cmdEntry.cmdStr+'" is not a valid command.\n' ;
    cmdEntry.conn.socket.write(output);
};

Commands.prototype.connect = function(cmdEntry) {
    assert.ok(is.object(cmdEntry));
    assert.ok(is.int(cmdEntry.cmdAry.length));

    if (cmdEntry.cmdAry.length < 3) {
        console.error('Insufficient arguments for command connect.');
        return;
    }

    assert.ok(cmdEntry.cmdAry);
    assert.ok(is.nonEmptyArray(cmdEntry.cmdAry));
    assert.ok(cmdEntry.cmdAry.length === 3);
    var playerName = cmdEntry.cmdAry[1];
    var hash = createHash(cmdEntry.cmdAry[2]);
    assert.ok(is.nonEmptyStr(playerName));
    assert.ok(is.nonEmptyStr(hash));

    global.mush.players.findByName(playerName, function(err, player) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            console.error('Error: '+err);
            return;
        }

        if (!player || player.hash !== hash) {
            cmdEntry.conn.socket.write('Either the password is incorrect or there is no player with that name.\n');
            return;
        }

        cmdEntry.conn.player.updateWithDbObj(player);
        cmdEntry.conn.player.connected = true;
        global.mush.Server.queCmdOutput(cmdEntry, player.name+' has connected.');
    });
};

Commands.prototype.create = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    assert.ok(is.array(cmdEntry.cmdArray));

    if (cmdEntry.cmdAry.length < 3) {
        console.error('Insufficient arguments for command connect');
        return;
    }
    assert.ok(cmdEntry.cmdArray.length === 3);
        
    var playerName = cmdEntry.cmdAry[1];
    var hash = createHash(cmdEntry.cmdAry[2]);
    assert.ok(is.nonEmptyStr(playerName));
    assert.ok(is.nonEmptyStr(hash));

    global.mush.players.findByName(playerName, function(err, player) {
        if (err) {
            console.error('Error: '+err);
            return;
        }

        assert.ok(player);
        assert.ok(is.object(player));

        if (player) {
            cmdEntry.conn.socket.write('There is already a player named "'+player.name+
                                       '". Please choose another name.\n');
            return;
        }

        global.mush.players.createPlayer(playerName, hash, function(err, newPlayer) {
            if (err) {
                console.error('Error: '+err);
                assert.ok(is.nonEmptyStr(err));
                return;
            }
            assert.ok(is.object(newPlayer));
            assert.ok(is.nonEmptyStr(newPlayer.name));
            cmdEntry.conn.player.updateWithDbObj(newPlayer);
            cmdEntry.conn.player.connected = true;
            global.mush.Server.queCmdOutput(cmdEntry, newPlayer.name+' has connected.');
        });
    });
};

Commands.prototype.look = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    //assert.ok(is.nonEmptyStr(cmdEntry.cmdStr));
    console.log('cmdEntry.cmdStr: "'+cmdEntry.cmdStr+'"');
    console.log('Look cmd: '+util.inspect(cmdEntry));
    cmdEntry.conn.socket.write('You don\'t see anything here.\n');
};

Commands.prototype.pose = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    assert.ok(is.nonEmptyStr(cmdEntry.cmdStr));
    var poseWithSpace = true;

    // how did we arrive here, with what form of pose?
    // need to handle ':', ';' but not pose.
    if (cmdEntry.cmdStr[0] === ':') {
        cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ':'
    } else if (cmdEntry.cmdStr[0] === ';') {
        poseWithSpace = false;
        cmdEntry.cmdStr = cmdEntry.cmdStr.slice(1); // remove ';'
    }

    assert.ok(is.nonEmptyStr(cmdEntry.conn.player.name));
    var output = cmdEntry.conn.player.name + 
        (poseWithSpace ? ' ' : '') + cmdEntry.cmdStr;
    global.mush.Server.queCmdOutput(cmdEntry, output);
};

Commands.prototype.say = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    assert.ok(is.nonEmptyStr(cmdEntry.cmdStr));

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
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    assert.ok(is.nonEmptyStr(cmdEntry.conn.player.name));
    var output = cmdEntry.conn.player.name + ' has logged out.';
    global.mush.Server.queCmdOutput(cmdEntry, output);
    cmdEntry.conn.socket.end();
};

Commands.prototype.who = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    var output = 'Players currently online:\n';
    for (var conn in global.mush.Server.ConnectionList) {
        // output += util.format('%s %d sec\n', 
        output += sprintf('%-15s %10d sec\n', 
                          global.mush.Server.ConnectionList[conn].player.name,
                          global.mush.Server.ConnectionList[conn].timeOnlineSecs());
    }
    cmdEntry.conn.socket.write(output);
};

////////////////////////////////////////////////////////////////////////////////

function createHash(strIn) {
    assert.ok(strIn);
    assert.ok(is.nonEmptyStr(strIn));
    var hmac = crypto.createHmac('sha1', 'potrzebie');
    hmac.update(strIn);
    var hash = hmac.digest('base64');
    assert.ok(hash);
    assert.ok(is.nonEmptyStr(hash));
    return hash;
}
