'use strict';

var assert = require('assert');
//var util = require('util');
var is = require('is2');

const TypeHash = {
    ROOM:    { letter: 'R', name: 'room'    },
    THING:   { letter: ' ', name: 'thing'   },
    EXIT:    { letter: 'E', name: 'exit'    },
    PLAYER:  { letter: 'P', name: 'player'  },
    ZONE:    { letter: 'z', name: 'zone'    },
    GARBAGE: { letter: 'g', name: 'garbage' }
};

function Type(typeName) {
    assert.ok(is.nonEmptyStr(typeName));
    assert.ok(TypeHash[typeName] !== undefined);
    this.type = typeName;
}

Type.prototype.get = function() {
    assert.ok(this.type);
    return this.type;
};

Type.prototype.getName = function() {
    assert.ok(TypeHash);
    assert.ok(TypeHash[this.type] !== undefined);
    assert.ok(TypeHash[this.type].name !== undefined);
    return TypeHash[this.type].name;
};

Type.prototype.getLetter = function() {
    assert.ok(TypeHash);
    assert.ok(TypeHash[this.type] !== undefined);
    assert.ok(TypeHash[this.type].letter !== undefined);
    return TypeHash[this.type].letter;
};

