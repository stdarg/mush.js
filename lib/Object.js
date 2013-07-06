/**
 * @fileOverview
 * The file Obj is a base class for all game objects types, which includes: players, rooms, exits and object.
 * The Object class stores the data common to all object types.
 */

'use strict';
exports.Obj = Obj;

var Flags = require('./flags').Flags;

/**
 * The Obj class is a the base class for all object types (except Objects).
 * @constructor
 */
function Obj(type) {

    this.data = {};
    this.data.loc = 0;
    this.db = {};
    this.Flags = new Flags();

    if (arguments.length === 1 && is.nonEmptyObj(arguments[0])) {
        this.updateWithDbObj(arguments[0]);
    } else if (arguments.length === 1 && is.str(type)) {
        this.data.type = type;
    } else {
        console.trace();
        log.error('Bad Object constructor args: %j', arguments);
    }
}

/**
 * Setter for flags. Awkward, but we need to special case the Flags objects.
 * @param {String} fName the name of the flag
 * @param {Boolean} val the value the flag is to be
 */
Obj.prototype.setFlag = function(fName, val) {
    this.Flags.set(fName, val);
    this.data.flags = this.Flags.export();
};

/**
 * Getter for flags. Awkward, but we need to special case the Flags objects.
 * @param {String} fName the name of the flag
 * @return {Boolean} The value of the flag for the iven name
 */
Obj.prototype.getFlag = function(fName) {
    return this.Flags.get(fName);
};

/**
 * get the type of the object in string name format, e.g. 'player'
 * @return {String} The string name describing the type of object.
 */
Obj.prototype.getTypeStr = function() {
    switch(this.type.toLowerCase()) {
    case 'p':
        return 'player';
    case 'r':
        return 'room';
    case 'e':
        return 'exit';
    case 'o':
        return 'object';
    default:
        return 'unknown';
    }
};

/**
 * Method to update all attributes from a database object.A
 * @param {Object} ddobj An object holding all the properties.
 */
Obj.prototype.updateWithDbObj = function(dbObj) {

    if (!dbObj) {
        log.error('Obj.updateWithDbObj: received a null argument for dbObj.');
        return;
    }

    if (dbObj.flags && dbObj.flags.bits && dbObj.flags.length) {
        this.flags.import(dbObj.flags);
        delete dbObj.flags;
    }

    assert.ok(dbObj.name && dbObj.name.length);
    this.data = dbObj;
};
////////////////////////////////////////////////////////////////////////////////
// Getters and setters for all the object-derived attributes follow.
// The following use the method defineProperty on the Object prototype to create
// getters and setters. So, it is supposed to be Object and not Obj.
//

/**
 * location - current location of the object
 */
Object.defineProperty(Obj.prototype, 'loc', {
    get: function() { return this.data.loc; },
    set: function(l) { this.data.loc = l; return this; }
});

/**
 * name the name of the objec
 */
Object.defineProperty(Obj.prototype, 'name', {
    get: function() { return this.data.name; },
    set: function(n) { this.data.name = n; return this; }
});

/**
 * type the type of the object: 'r', 'p', 'e', 'o'
 * Note, objects don't change type: there is no set
 */
Object.defineProperty(Obj.prototype, 'type', {
    get: function() { return this.data.type; },
});


/**
 * sex (gender)
 */
Object.defineProperty(Obj.prototype, 'sex', {
    get: function() { return this.data.sex; },
    set: function(s) { this.data.sex = s; return this; }
});

/**
 * desc (description)
 */
Object.defineProperty(Obj.prototype, 'desc', {
    get: function() { return this.data.desc; },
    set: function(d) { this.data.desc = d; return this; }
});

/**
 * owner - who owns this object
 */
Object.defineProperty(Obj.prototype, 'owner', {
    get: function() { return this.data.owner; },
    set: function(o) { this.data.owner = o; return this; }
});

/**
 * id - the dbref of this object
 */
Object.defineProperty(Obj.prototype, 'id', {
    get: function() { return this.data.id; },
    set: function(i) { this.data.Id = i; return this; }
});

/**
 * CREATED - date the object was create
 */
Object.defineProperty(Obj.prototype, 'CREATED', {
    get: function() { return this.data.CREATED; },
    set: function(c) { this.data.CREATED = c; return this; }
});

/**
 * HOME - the home for the object
 */
Object.defineProperty(Obj.prototype, 'HOME', {
    get: function() { return this.data.HOME; },
    set: function(h) { this.data.HOME = h; return this; }
});
