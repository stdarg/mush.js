/**
 * @fileOverview This file defines the Room object which describes a room.
 * Any logic or data specific to rooms goes here.
 */

'use strict';

module.exports = Room;
var Obj = require('./object');
util.inherits(Room, Obj);

/**
 * Creates a Room object.
 * @constructor
 */
function Room(obj) {
    Obj.call(this, 'r', obj);
}
