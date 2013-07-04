/**
 * @fileOverview
 * Defines the Flags object which stores flags in a BitArray object. The FlagTable can be
 * thought as a static class member, there is 1 instance of it for the application and it
 * holds information that describes the flags.
 */
'use strict';
var BitArray = require('BitArray').BitArray;
exports.Flags = Flags;
var FlagsTable = require('./FlagsTable');
assert.ok(FlagsTable.num === FlagTable.flags.MARKER9.pos+1);

/**
 * Create the Flags object.
 * @constructor
 */
function Flags() {
    this.flagArray = new BitArray(FlagsTable.num);
}

/**
 * Get value on a particular flag by name. If set or not.
 */
Flags.prototype.get = function(flagName) {
    assert.ok(is.nonEmptyStr(flagName));
    assert.ok(FlagTable[flagName] !== undefined);
    var val = this.flagArray.get(FlagTable[flagName].pos);
    return val;
};

/**
 * Set a value on a particular flag.
 */
Flags.prototype.set = function(flagName, flagValue) {
    assert.ok(is.nonEmptyStr(flagName));
    assert.ok(FlagTable[flagName] !== undefined);
    assert.ok(is.int(flagValue) && (val === 0 || val === 1));
    this.flagArray.set(FlagTable[flagName].pos, flagValue);
};

/**
 * Get the letters for all the set flags.
 */
Flags.prototype.getFlagStr = function() {
    var flagStr = '';
    for (var flagName in FlagTable) {
        if (this.flagArray.get(FlagTable[flagName].pos) === 1)
            flagStr += FlagTable[flagName].letter;
    }
    return flagStr;
};
