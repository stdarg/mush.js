/**
 * @fileOverview
 * Commands.js has the code for each command that can be executed.
 */

'use strict';
exports.Commands = Commands;

/**
 * Create the commands object.
 * @constructor
 */
function Commands() {}

/**
 * Boolean test to determine if a command is valid.
 * @param {String} cmd String containing the command name.
 * @return {Boolean} true if the command is valid, false otherwise.
 */
Commands.prototype.isValidCmd = function(cmd) {
    assert.ok(is.nonEmptyStr(cmd));
    if (this.table[cmd] === undefined)
        return false;
    return true;
};

/**
 * Display an error resulting from processing a command.
 * @param {Object} The command being run w/ context.
 * @private
 */
Commands.prototype._error = function(cmdEntry) {
    assert.ok(is.object(cmdEntry));
    assert.ok(is.nonEmptyStr(cmdEntry.origCmdStr));
    var output = '"'+cmdEntry.origCmdStr+'" is not a valid command.\n' ;
    cmdEntry.conn.socket.write(output);
};

/**
 * Process the connect command on behalf of a player.
 * @param {Object} The command being run w/ context.
 */
Commands.prototype.connect = function(cmdEntry) {
    assert.ok(is.object(cmdEntry));
    assert.ok(is.int(cmdEntry.cmdAry.length));
    assert(cmdEntry.cmdAry.length >= 3);
    assert.ok(cmdEntry.cmdAry);
    assert.ok(is.nonEmptyArray(cmdEntry.cmdAry));

    var playerName = cmdEntry.cmdAry[1];
    var hash = MushUtils.createHash(cmdEntry.cmdAry[2]);
    assert.ok(is.nonEmptyStr(playerName));
    assert.ok(is.nonEmptyStr(hash));

    global.mush.players.findByName(playerName, function(err, player) {
        if (err) {
            assert.ok(is.nonEmptyStr(err));
            log.error('Commands.connect: %j', err);
            return;
        }

        if (!player || player.hash !== hash) {
            cmdEntry.conn.socket.write('Either the password is incorrect or there is no'+
                                      ' player with that name.\n');
            return;
        }

        cmdEntry.conn.player.login(player);
        global.mush.Server.queCmdOutput(cmdEntry, player.name+' has connected.');
    });
};

/**
 * Create a new player from the intro screen
 * @param {Object} The command being run w/ context.
 */
Commands.prototype.create = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    assert.ok(is.array(cmdEntry.cmdAry));
    assert.ok(cmdEntry.cmdAry.length >= 3);

    var playerName = cmdEntry.cmdAry[1];
    var hash = MushUtils.createHash(cmdEntry.cmdAry[2]);
    assert.ok(is.nonEmptyStr(playerName));
    assert.ok(is.nonEmptyStr(hash));

    global.mush.players.findByName(playerName, function(err, player) {
        if (err) {
            log.error('Commands.create: %j', err);
            return;
        }

        if (player) {
            cmdEntry.conn.socket.write('There is already a player named "'+player.name+
                                       '". Please choose another name.\n');
            return;
        }

        global.mush.players.createPlayer(playerName, hash, function(err, newPlayer) {
            if (err) {
                log.error('Commands.create: %j', err);
                assert.ok(is.nonEmptyStr(err));
                return;
            }

            assert.ok(is.object(newPlayer));
            assert.ok(is.nonEmptyStr(newPlayer.name));      // FIXME
            cmdEntry.conn.player.login(newPlayer);
            global.mush.Server.queCmdOutput(cmdEntry, newPlayer.name+' has connected.');
        });
    });
};

/**
 * Set the description text on an object.
 * @param {Object} The command being run w/ context.
 */
Commands.prototype.describe = function(cmdEntry) {
    assert.ok(is.object(cmdEntry));
    assert.ok(is.array(cmdEntry.cmdAry));

    if (cmdEntry.cmdAry.length < 2)
        cmdEntry.conn.socket.write('What is it you want to describe?');

    // grab description string - limit split to giving 2 results
    var ary = cmdEntry.cmdStr.split('=', 2);
    if (ary.length === 1) {
        cmdEntry.conn.socket.write(sprintf('You want to describe "%s" as what?\n', ary[0]));
        return;
    }

    var target = ary[0];        // what is being described
    var descText = ary[1];      // the text of the description

    if (target === 'here') {
        global.mush.objects.findById(cmdEntry.conn.player.loc, function(err) {
            if (err) return log.error('Commands.describe objects.findById: %j', err);
            cmdEntry.conn.socket.write('Not yet supported\n');
            return;
        });
    } else if (target === 'me') {
        var obj = cmdEntry.conn.player;
        cmdEntry.conn.socket.write(sprintf('You describe yourself: %s\n', descText));
        obj.desc = descText;
    } else {
        cmdEntry.conn.socket.write(sprintf('ary: %s\n', util.inspect(cmdEntry)));
    }
};

/**
 * Have an object look (not just players look)
 * @param {Object} The command being run w/ context.
 */
Commands.prototype.look = function(cmdEntry) {
    assert.ok(is.object(cmdEntry));
    assert.ok(is.array(cmdEntry.cmdAry));

    var target = 'here';
    if (cmdEntry.cmdAry.length > 1)
        target = cmdEntry.cmdAry[1];

    if (target === 'here') {
        global.mush.objects.findById(cmdEntry.conn.player.loc, function(err, obj) {
            if (err) return log.error('Commands.look objects.findById: %j', err);
            cmdEntry.conn.socket.write(sprintf('%s(#%d)\n%s\n', obj.name, obj.id, obj.desc));
            return;
        });
    } else if (target === 'me') {
        var obj = cmdEntry.conn.player;
        cmdEntry.conn.socket.write(sprintf('%s(#%d)\n%s\n', obj.name, obj.id, obj.desc));
    } else {
        cmdEntry.conn.socket.write('You don\'t see "'+ target +'" here.\n');
    }
};

/**
 * Have an object pose, e.g.: <object name> smiles.
 * @param {Object} The command being run w/ context.
 */
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

/**
 * Have an object pose, e.g.: <object name> smiles.
 * @param {Object} The command being run w/ context.
 */
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

/**
 * Allow a player to quit the game.
 * @param {Object} The command being run w/ context.
 */
Commands.prototype.quit = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    assert.ok(is.nonEmptyStr(cmdEntry.conn.player.name));
    var output = cmdEntry.conn.player.name + ' has logged out.';
    global.mush.Server.queCmdOutput(cmdEntry, output);
    cmdEntry.conn.socket.end();
};

/**
 * Allow a player to see who is logged on.
 * @param {Object} The command being run w/ context.
 */
Commands.prototype.who = function(cmdEntry) {
    assert.ok(cmdEntry);
    assert.ok(is.object(cmdEntry));
    var output = 'Players currently online:\n';
    var count = 0;
    for (var conn in global.mush.Server.ConnectionList) {
        // output += util.format('%s %d sec\n',
        output += sprintf('%-15s %10d sec\n',
                          global.mush.Server.ConnectionList[conn].player.name,
                          global.mush.Server.ConnectionList[conn].timeOnlineSecs());
        count++;
    }
    if (count === 1)
        output += 'There is 1 player online.\n';
    else
        output += 'There are '+count+' players online.\n';
    cmdEntry.conn.socket.write(output);
};
