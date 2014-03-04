/**
 * @fileOverview
 * Contains and object ParseCmd which will, when given an cmdEntry, return an entry from the
 * CommandTable object. Essentially, given a description of the user input, this object retrieves
 * the correct command description or an error, if nothing matches.
 */
'use strict';
var CommandTable = require('./cmd_table').CommandTable;
exports.ParseCmd = ParseCmd;

/**
 * Creates an instance of ParseCmd and instantiates a CommandTable.
 */
function ParseCmd() {
    this.cmdTable = new CommandTable();
}

/**
 * Given a command entry, containig the user-input, parseCommand will find the right command
 * entry or error, if no match exists, and return that entry to the calling function.
 * @param {object} cmdEntry An object with the user input that needs to be matched to an command
 * @return {object} An entry from the command table, describing how to execute the object.
 */
ParseCmd.prototype.parseCommand = function(cmdEntry) {
    assert.ok(is.object(cmdEntry));
    assert.ok(is.object(cmdEntry.conn));
    assert.ok(is.object(this.cmdTable));

    cmdEntry.cmdStr = cmdEntry.cmdStr.toString('utf8');
    var cmd;
    var shortCmd = false;
    log.info('cmd : %s', cmdEntry.cmdStr);

    // Handle 1-char cmds - these are special cases where the first
    // white-space separated token has the command followed by the input
    // with no whitespace separator, e.g. ':smiles broadly.'
    log.info('parseCommand %j',cmdEntry.cmdAry);

    switch (cmdEntry.cmdStr[0]) {
    case '"':
    case '\'':
        cmd = this.cmdTable.get('say');
        shortCmd = true;
        break;
    case ':':
    case ';':
        cmd = this.cmdTable.get('pose');
        shortCmd = true;
        break;
    }

    // no 1-char command matched, hash to command in table
    if (!cmd)
        cmd = this.cmdTable.get(cmdEntry.cmdAry[0]);

    log.info('cmd = %j',cmd);
    // ensure cmd is valid for this player
    if (_cmdIsValid(cmd, cmdEntry)) {
        if (!shortCmd)
            cmdEntry.cmdStr = _consumeFirstWordAndWhiteSpace(cmdEntry.cmdStr);
    } else {
        cmd = this.cmdTable.getError();
    }

    return cmd;
};

/**
 * A convenience function to ensure diconnected players don't say and pose and
 * connected players don't create and connect and everyone can type who or quit.
 * It's not a method, because it does not need to be. Maybe later this will change.
 * @private
 * @param {object} A command descriptor from the CommandTable.
 * @param {object} An object with the user and user input.
 * @returns {boolean} True, if the command is valid for the player and false
 * otherwise.
 */
function _cmdIsValid(cmd, cmdEntry) {
    assert.ok(is.nonEmptyObj(cmdEntry));
    assert.ok(is.nonEmptyObj(cmdEntry.conn));
    //assert.ok(is.nonEmptyObj(cmdEntry.conn.player));

    if (typeof cmd !== 'object')
        return false;

    // if player is connected and connected players can't use the command
    if (cmdEntry.conn.player !== null && cmd.conPlayer === false)
        return false;

    // if player is disconnected and disconnected players can't use the command
    if (cmdEntry.conn.player === null && cmd.dconPlayer === false)
        return false;

    return true;
}

/**
 * A convenience function to consume the first white-space separated token
 * and the following white-space. It's not a method because it does not
 * need to be.
 * @api private
 * @param {String} The string from which to consume the token and white-space.
 * @return {String} The string with the token and whitespace removed.
 */
function _consumeFirstWordAndWhiteSpace(str) {
    assert.ok(is.nonEmptyString(str));

    // skip over non-white spave
    // FIXME: is.whiteSpace
    for (var i=0; i<str.length; i++) {
        if (' \t\n\r\v\f'.indexOf(str.charAt(i)) !== -1)
            break;
    }

    // we are now on ws, skip it
    // FIXME: is.whiteSpace
    for (; i<str.length; i++) {
        if (' \t\n\r\v\f'.indexOf(str.charAt(i)) === -1)
            break;
    }

    var rstr = str.substring(i);
    return rstr;
}
