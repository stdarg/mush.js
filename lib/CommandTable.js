/**
 * @fileOverview The CommandTable is an object for storing and looking commands and aliases to commands. The 
 * commands and aliases exist as propeties on an object, so the lookup time is O(1). The entry for each 
 * command defines how the mush uses the command, e.g. how many arguments, the function handler and wheather 
 * or not connected/disconnected player can use the command.
 */
'use strict';

var util = require('util');
var assert = require('assert');
var Commands = require('./Commands').Commands;
var is = require('./is');

exports.CommandTable = CommandTable;    // for external visibility

// The below table may seem awkward for an object. However, in node, the JS 'global scope' is confined to a module (file).
// Without the exports, it is not visible outside the module. The means the data is like a static in C, so many instances
// of CommandTable can exist, but all will refer to the same data. Though, in our case, I expect only 1 instance.
var cmdTab = {};

/**
 * Creates a new CommandTable, adds the commands and their aliases to the table.
 * @constructor
 */
function CommandTable() {
    var noConPlayer  = false, yesConPlayer  = true;
    var noDconPlayer = false, yesDconPlayer = true;

    // add the commands and their aliases
    this.addCmd('connect', 2, Commands.prototype.connect, noConPlayer,  yesDconPlayer);
    this.makeAlias('connect', 'connec');
    this.makeAlias('connect', 'conne');
    this.makeAlias('connect', 'conn');
    this.makeAlias('connect', 'con');
    this.makeAlias('connect', 'co');
    this.makeAlias('connect', 'c');

    this.addCmd('create',  2, Commands.prototype.create,  noConPlayer,  yesDconPlayer);
    this.makeAlias('create', 'creat');
    this.makeAlias('create', 'crea');
    this.makeAlias('create', 'cre');
    this.makeAlias('create', 'cr');

    this.addCmd('look',  -1, Commands.prototype.look,     yesConPlayer,  noDconPlayer);
    this.makeAlias('look', 'loo');
    this.makeAlias('look', 'lo');
    this.makeAlias('look', 'l');

    this.addCmd('pose',    1, Commands.prototype.pose,    yesConPlayer, noDconPlayer );
    this.makeAlias('pose', 'pos');
    this.makeAlias('pose', 'po');
    this.makeAlias('pose', 'p');

    // we don't want to alias quit to shortened versions, to prevent accidental quit-tation.
    this.addCmd('quit',    0, Commands.prototype.quit,    yesConPlayer, yesDconPlayer);
    this.makeAlias('quit', 'QUIT');
    this.makeAlias('quit', 'LOGOUT');
    this.makeAlias('quit', 'logout');

    this.addCmd('say',     1, Commands.prototype.say,     yesConPlayer, noDconPlayer );
    this.makeAlias('say', 'sa');
    this.makeAlias('say', 's');

    this.addCmd('who',     0, Commands.prototype.who,     yesConPlayer, yesDconPlayer);
    this.makeAlias('who', 'WHO');
    this.makeAlias('who', 'wh');
    this.makeAlias('who', 'w');

    // we keep the error message out of the command table, so it is not matched.
    this._error = {
        name: '_error',  
        numArgs: 0,
        func: Commands.prototype._error,
        conPlayer: yesConPlayer,
        dconPlayer: yesDconPlayer
    };

    // make the values read-only
    for (var prop in this._error) {
        Object.defineProperty(this._error, prop, {
            value: this._error[prop],
            writable: false,
            enumerable: true,
            configurable: true
        });
    }
}
/**
 * Adds a command to the command table with parameters defining how the command can be used.
 * @param {string} name The name of the command.
 * @param {number} numArgs The number arguments this command has.
 * @param {function} funcHandler The function execution to perform the command.
 * @param {boolean} connectedCmd True if connected player can use the command.
 * @param {boolean} disconnectedCmd True if dicsonnected player can use the command.
 */
CommandTable.prototype.addCmd = function(name, numArgs, funcHandler, connectedCmd, disconnectedCmd) {
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

    // make the cmd object read-only
    for (var prop in cmdTab[name]) {
        Object.defineProperty(cmdTab[name], prop, {
            value: cmdTab[name][prop],
            writable: false,
            enumerable: true,
            configurable: true
        });
    }
};

/**
 * Creates an alias for command. The creates a new lookup name in the containing object. All
 * other data is the same.
 * @param {string} Name of the actual command.
 * @param {string} Name of the alias to the command.
 */
CommandTable.prototype.makeAlias = function(cmdName, aliasName) {
    assert.ok(is.nonEmptyStr(cmdName));
    assert.ok(is.nonEmptyStr(aliasName));
    assert.ok(cmdTab[cmdName] !== undefined);
    assert.ok(cmdTab[aliasName] === undefined);

    // this is not a deep copy, instead it's more like a reference
    cmdTab[aliasName] = cmdTab[cmdName];
};

/**
 * Given the name of the command, getCmd will lookup and retrieve the command entry.
 * @param {string} name Name of the command for which, you want the entry.
 */
CommandTable.prototype.get = function(name) {
    assert.ok(is.nonEmptyStr(name));
    assert.ok(cmdTab[name]);
    return cmdTab[name];
};

/**
 * Given the name of the command, getCmd will lookup and retrieve the command entry.
 * @param {string} name Name of the command for which, you want the entry.
 */
CommandTable.prototype.getError = function() {
    assert.ok(is.obj(this._error));
    return this._error;
};
