/**
 * @fileOverview This file defines the Room object which describes a room.
 * Any logic or data specific to rooms goes here.
 */

'use strict';

exports.Room = Room;
var Obj = require('./object').Obj;
util.inherits(Room, Obj);

/**
 * Creates a Room object.
 * @constructor
 */
function Room() {
    Room.super_.call(this, 'r');
}