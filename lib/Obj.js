/**
 * @fileOverview
 * The file Obj is a base  class for all game objects, and stores all the methods and data common
 * to Players, Exits, Rooms, and Things.
 */
'use strict';

var assert = require('assert');
var util = require('util');

var Collection = require('./Db').Collection;
var is = require('./is');
var Flags = require('./Flags').Flags;
var Type = require('./Type').Type;

exports.Obj = Obj;

/*
Tangent(#124Pc)
Type: PLAYER Flags: CONNECTED
Desc [($DV)]: You see a trigonometric function. It looks acute.
Owner: Tangent  Key: *UNLOCKED* Pennies: 200
Accessed: Sun May 20 14:53:25 2012    Modified: Sun May 20 14:53:00 2012
Zone: *NOTHING*
Powers:
Last [($Vcw)]: Sun May 20 14:52:59 2012
Lastsite [($cg)]: 67.80.208.web-pass.com
FIRST [(w)]: Sat May  5 16:37:05 2012
FIRSTSITE [(w)]: 67.80.208.web-pass.com
Lastip [($cg)]: 208.80.67.57
No exits.
Home: Wax Cell(#0RJ)
Location: Wax Cell(#0RJ)
*/

function Obj(Type, Flags) {
    this.Flags = Flags
    this.Type = Type;
}

Obj.prototype.setDbData = function(data) {
};

Obj.prototype.getDbData = function() {
};

