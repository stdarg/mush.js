/**
 * @fileOverview This file defines the Exit object which describes a Exit.
 * Any logic or data specific to Exits goes here.
 */

'use strict';

module.exports = Exit;
var Obj = require('./object');
util.inherits(Exit, Obj);

/**
 * Creates a Exit object.
 * @constructor
 */
function Exit() {
    //Exit.super_.call(this, 'e');
    Obj.call(this, 'e');
}
