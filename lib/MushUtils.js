'use strict';

var assert = require('assert');
var is = require('./is');

exports.createHash = function(strIn) {
    assert.ok(strIn);
    assert.ok(is.nonEmptyStr(strIn));

    var crypto = require('crypto');
    var hmac = crypto.createHmac('sha1', 'potrzebie');
    hmac.update(strIn);

    var hash = hmac.digest('base64');
    assert.ok(hash);
    assert.ok(is.nonEmptyStr(hash));

    return hash;
};

exports.makeObjReadOnly = function(obj) {
    assert.ok(is.obj(obj));
    for (var prop in obj) {
        Object.defineProperty(obj, prop, {
            value:          obj[prop],
            writable:       false,
            enumerable:     true,
            configurable:   true
        });
    }
};
