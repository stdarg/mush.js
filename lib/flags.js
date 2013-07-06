/**
 * @fileOverview
 * Defines the Flags object which stores flags in a BitArray object. The flag_tbl can be
 * thought as a static class member, there is 1 instance of it for the application and it
 * holds information that describes the flags.
 */
'use strict';
exports.Flags = Flags;

var BitArray = require('minimal-bit-array');
var flag_tbl = require('./flag_table');

/**
 * Create the Flags object.
 * @constructor
 */
function Flags(obj) {
    this.BitFlags = new BitArray(flag_tbl.num);
    if (obj && is.defined(obj.length) && is.defined(obj.bits))
        this.BitFlags.import(obj);
}

/**
 * Get value on a particular flag by name. If set or not.
 */
Flags.prototype.get = function(flagName) {
    assert.ok(is.nonEmptyStr(flagName));
    assert.ok(flag_tbl.flags[flagName] !== undefined);
    var val = this.BitFlags.get(flag_tbl.flags[flagName].pos);
    return val;
};

/**
 * Set a value on a particular flag.
 */
Flags.prototype.set = function(flagName, flagValue) {
    assert.ok(is.nonEmptyStr(flagName));
    assert.ok(is.bool(flagValue) || (is.int(flagValue && (flagValue === 0 || flagValue === 1))));
    //log.info('flag_tbl: %s', util.inspect(flag_tbl, {colors: true}));
    assert.ok(flag_tbl.flags[flagName] !== undefined);
    this.BitFlags.set(flag_tbl.flags[flagName].pos, flagValue);
};

/**
 * Get the letters for all the set flags.
 */
Flags.prototype.getFlagStr = function() {
    var flagStr = '';
    for (var flagName in flag_tbl) {
        if (this.BitFlags.get(flag_tbl.flags[flagName].pos) === 1)
            flagStr += flag_tbl.flags[flagName].letter;
    }
    return flagStr;
};

/**
 * Get the flags in a format suitable for persitance
 * @return {Object} An object with 2 properties, bits & length.
 */
Flags.prototype.export = function() {
    return this.BitFlags.export();
};
