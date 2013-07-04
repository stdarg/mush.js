/**
 * @fileOverview
 * Types.js defines the available object types.
 * Right now, this is not used.
 */

'use strict';

// a table with all type definitions
const TypeHash = {
    room:    { letter: 'R', name: 'room'    },
    thing:   { letter: ' ', name: 'thing'   },
    exit:    { letter: 'E', name: 'exit'    },
    player:  { letter: 'P', name: 'player'  },
    zone:    { letter: 'z', name: 'zone'    },
    garbage: { letter: 'g', name: 'garbage' }
};

/**
 * Create a type object
 * @param {String} typeName The name of the type, e.g. "room"
 * @constrcutor
 */
function Type(typeName) {
    assert.ok(is.nonEmptyStr(typeName));
    assert.ok(TypeHash[typeName] !== undefined);
    this.type = typeName;
}

/**
 * get the type
 * @return {String} The name of the type.
 *
 */
Type.prototype.get = function() {
    assert.ok(this.type);
    return this.type;
};

/**
 * get the type name from the table
 * @return {String} The name of the type from the table
 */
Type.prototype.getName = function() {
    assert.ok(TypeHash);
    assert.ok(TypeHash[this.type] !== undefined);
    assert.ok(TypeHash[this.type].name !== undefined);
    return TypeHash[this.type].name;
};

/**
 * get the letter associated with the type
 */
Type.prototype.getLetter = function() {
    assert.ok(TypeHash);
    assert.ok(TypeHash[this.type] !== undefined);
    assert.ok(TypeHash[this.type].letter !== undefined);
    return TypeHash[this.type].letter;
};

