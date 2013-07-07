/**
 * @fileOverview
 * Types.js defines the available object types.
 * Right now, this is not used.
 */

'use strict';

// a table with all type definitions
const TypeTable = {
    r:  { letter: 'r', name: 'room'    },
    o:  { letter: 'o', name: 'thing'   },
    e:  { letter: 'e', name: 'exit'    },
    p:  { letter: 'P', name: 'player'  },
    z:  { letter: 'z', name: 'zone'    },
    g:  { letter: 'g', name: 'garbage' }
};

/**
 * Create a type object
 * @param {String} typeName The name of the type, e.g. "room"
 * @constrcutor
 */
function Type(typeLetter) {
    assert.ok(is.nonEmptyStr(typeLetter));
    assert.ok(is.nonEmptyObj(TypeTable[typeLetter]));
    this.type = TypeTable[typeLetter];
}

/**
 * get the type name from the table
 * @return {String} The name of the type from the table
 */
Type.prototype.getName = function() {
    return this.type.name;
};

/**
 * get the letter associated with the type
 */
Type.prototype.getLetter = function() {
    return this.type.letter;
};

