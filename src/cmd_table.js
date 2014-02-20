/**
* @fileOverview
 * The CommandTable is an object for storing and looking commands and aliases to commands. The
 * commands and aliases exist as propeties on an object, so the lookup time is O(1). The entry
 * for each command defines how the mush uses the command, e.g. how many arguments, the function
 * handler and wheather or not connected/disconnected player can use the command.
 */
'use strict';
exports.CommandTable = CommandTable;    // for external visibility

// Load the actual code for the commands
var Commands = require('./commands').Commands;

// The below table may seem awkward for an object. However, in node, the JS 'global scope' is
// confined to a module (file). Without the exports, it is not visible outside the module. The
// means the data is like a static in C, so many instances of CommandTable can exist, but all
// will refer to the same data. Though, in our case, I expect only 1 instance.
var cmdTab = {};

/**
 * Creates a new CommandTable, adds the commands and their aliases to the table.
 * @constructor
 */
function CommandTable() {
    var noConPlayer  = false;
    var yesConPlayer  = true;
    var noDconPlayer = false;
    var yesDconPlayer = true;
    var NOshortAliases = false;
    var shortAliases = true;

    // add the commands and their aliases
    this._addCmd('connect',     2, Commands.prototype.connect,  noConPlayer,  yesDconPlayer, NOshortAliases);
    this._addCmd('create',      2, Commands.prototype.create,   noConPlayer,  yesDconPlayer, NOshortAliases);
    this._addCmd('look',       -1, Commands.prototype.look,     yesConPlayer, noDconPlayer,  shortAliases);
    this._addCmd('pose',        1, Commands.prototype.pose,     yesConPlayer, noDconPlayer,  shortAliases);
    this._addCmd('quit',        0, Commands.prototype.quit,     yesConPlayer, yesDconPlayer, NOshortAliases);
    this._addCmd('say',         1, Commands.prototype.say,      yesConPlayer, noDconPlayer,  shortAliases);
    this._addCmd('who',         0, Commands.prototype.who,      yesConPlayer, yesDconPlayer, shortAliases);
    this._addCmd('@describe',   0, Commands.prototype.describe, yesConPlayer, noDconPlayer,  shortAliases);
    //this._addCmd('@dig',        0, Commands.prototype.dig,      yesConPlayer, noDconPlayer,  shortAliases);

    // additional aliases
    this._makeAlias('who',     'WHO');
    this._makeAlias('quit',    'QUIT');
    this._makeAlias('quit',    'LOGOUT');
    this._makeAlias('quit',    'logout');
    this._makeAlias('connect', 'CONNECT');
    this._makeAlias('create',  'CREATE');

    // we keep the error message out of the command table, so it is not matched.
    this._error = {
        name: '_error',
        numArgs: 0,
        func: Commands.prototype._error,
        conPlayer: yesConPlayer,
        dconPlayer: yesDconPlayer
    };

    mush_utils.makeImmutableRecurse(this._error);
}

/**
 * Adds a command to the command table with parameters defining how the command can be used.
 * @private
 * @param {string} name The name of the command.
 * @param {number} numArgs The number arguments this command has.
 * @param {function} funcHandler The function execution to perform the command.
 * @param {boolean} connectedCmd True if connected player can use the command.
 * @param {boolean} disconnectedCmd True if disconnected player can use the command.
 */
CommandTable.prototype._addCmd = function(name, numArgs, funcHandler, connectedCmd, disconnectedCmd,
                                          makeShortAliases) {

    makeShortAliases = typeof makeShortAliases !== 'undefined' ? makeShortAliases : true;
    assert.ok(is.nonEmptyStr(name));
    assert.ok(is.int(numArgs));
    assert.ok(is.func(funcHandler));
    assert.ok(is.bool(connectedCmd));
    assert.ok(is.bool(disconnectedCmd));
    assert.ok(cmdTab[name] === undefined);

    // add command to table
    cmdTab[name] = {
        name:       name,
        numArgs:    numArgs,
        func:       funcHandler,
        conPlayer:  connectedCmd,
        dconPlayer: disconnectedCmd
    };

    mush_utils.makeImmutableRecurse(cmdTab[name]);
    log.debug('Command: %s', name);
    if (!makeShortAliases) return;

    // make all possible aliases
    var alias = name;
    for (var i=1; i<name.length; i++) {
        alias = name.substring(0, name.length-i);
        if (name[0] === '@' && alias.length < 4)
            break;
        this._makeAlias(name, alias);
    }
};

/**
 * Creates an alias for command. The creates a new lookup name in the containing object. All
 * other data is the same.
 * @private
 * @param {string} Name of the actual command.
 * @param {string} Name of the alias to the command.
 */
CommandTable.prototype._makeAlias = function(cmdName, aliasName) {
    if (is.obj(cmdTab[aliasName])) return;
    log.debug('Adding alias for \'%s\' as \'%s\'', cmdName, aliasName);
    assert.ok(is.nonEmptyStr(cmdName));
    assert.ok(is.nonEmptyStr(aliasName));
    assert.ok(cmdTab[cmdName] !== undefined);
    assert.ok(cmdTab[aliasName] === undefined);

    // this is not a deep copy, instead it's more like a reference
    cmdTab[aliasName] = cmdTab[cmdName];
};

/**
 * Given the name of the command, getCmd will lookup and retrieve the command entry.
 * @public
 * @param {string} name Name of the command for which, you want the entry.
 * @return {Object} The command table entry for the corresponding command
 */
CommandTable.prototype.get = function(name) {
    assert.ok(is.nonEmptyStr(name));
    if (typeof cmdTab[name] !== 'object')
        return this._error;
    return cmdTab[name];
};

/**
 * Given the name of the command, getCmd will lookup and retrieve the command entry.
 * @public
 * @param {string} name Name of the command for which, you want the entry.
 */
CommandTable.prototype.getError = function() {
    assert.ok(is.obj(this._error));
    return this._error;
};
