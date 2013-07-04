/**
 * @fileOverview
 * The file Obj is a base class for all game objects types, which includes: players, rooms, exits and object.
 * The Object class stores the data common to all object types.
 */

'use strict';
exports.Obj = Obj;

/**
 * The Obj class is a the base class for all object types (except Objects).
 * @constructor
 */
function Obj(Name, Type) {
    this.data = {};
    this.data.loc = -1;
    this.db = {};
}

////////////////////////////////////////////////////////////////////////////////
// Getters and setters for all the object-derived attributes follow.
//

/**
 * location - current location of the object
 */
Object.defineProperty(Obj.prototype, "loc", {
    get: function() { return this.data.loc; },
    set: function(l) { this.data.loc = l; return this; }
});

/**
 * name the name of the objec
 */
Object.defineProperty(Obj.prototype, "name", {
    get: function() { return this.data.name; },
    set: function(n) { this.data.name = n; return this; }
});

/**
 * sex (gender)
 */
Object.defineProperty(Obj.prototype, "sex", {
    get: function() { return this.data.sex; },
    set: function(s) { this.data.sex = s; return this; }
});

/**
 * desc (description)
 */
Object.defineProperty(Obj.prototype, "desc", {
    get: function() { return this.data.desc; },
    set: function(d) { this.data.desc = d; return this; }
});

/**
 * owner - who owns this object
 */
Object.defineProperty(Obj.prototype, "owner", {
    get: function() { return this.data.owner; },
    set: function(o) { this.data.owner = o; return this; }
});

/**
 * id - the dbref of this object
 */
Object.defineProperty(Obj.prototype, "id", {
    get: function() { return this.data.id; },
    set: function(i) { this.data.Id = i; return this; }
});

/**
 * CREATED - date the object was create
 */
Object.defineProperty(Obj.prototype, "CREATED", {
    get: function() { return this.data.CREATED; },
    set: function(c) { this.data.CREATED = c; return this; }
});

/**
 * HOME - the home for the object
 */
Object.defineProperty(Obj.prototype, "HOME", {
    get: function() { return this.data.HOME; },
    set: function(h) { this.data.HOME = i; return this; }
});

/**
 * Method to update all attributes from a database object.A
 * @param {Object} ddobj An object holding all the properties.
 */
Obj.prototype.updateWithDbObj = function(dbObj) {

    if (!dbObj) {
        log.error('Obj.updateWithDbObj: received a null argument for dbObj.');
        return;
    }

    assert.ok(dbObj.name && dbObj.name.length);
    //this.name = dbObj.name;
    this.data = dbObj;
};
