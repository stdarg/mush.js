/**
 * A very simple configuration utility, that uses a JavaScript file as a config. The '.js' file must
 * have the config data in module.exports, e.g.:
 *
 * module.exports = {
 *     region : 'US',
 *     port : 4201,
 *     [...]
 * };
 */
'use strict';

var assert = require('assert');
var is = require('./is');
var fs = require('fs');
var path = require('path');
exports.Config = Config;

/**
 * A wrapper object providing a simple read-only API for a configuration object.
 * @param {string} pathToConfigFile The configuration file
 * @param {string} [region] An optional indicator for the current region (e.g. 'US','JP').
 */
function Config(pathToConfigFile, region) {

    assert.ok(is.nonEmptyStr(pathToConfigFile));
    assert.ok(is.nonEmptyStr(region));

    if (pathToConfigFile === undefined || pathToConfigFile.length === 0)
        throw new Error('The argument, pathToConfigFile, is not valid.');

    if (!path.existsSync(pathToConfigFile))
        throw new Error('There is no file at "'+pathToConfigFile+'".');

    this.pathToConfigFile = pathToConfigFile;
    this.region = region;
    var self = this;    // in the watchFIle CB, 'this' has no meaning

    // set a watch for when the file changes, to reload the file.
    // cab function (curr, prev)
    fs.watchFile(this.pathToConfigFile, function () {
        self.loadConfig(self.pathToConfigFile, self.region);
    });

    // we ca't wait for the file to change to re-load, so we load it now
    this.loadConfig(this.pathToConfigFile, this.region);
}

/**
 * Is the specified argument a regular javascript object?
 *
 * The argument is an object if it's a JS object, but not an array.
 *
 * @protected
 * @method _isObject
 * @param {MIXED} arg An argument of any type.
 * @return {boolean} TRUE if the arg is an object, FALSE if not
 */
Config.prototype.isObject = function(obj) {
    return (typeof obj === 'object') && !(Array.isArray(obj));
};

/**
 * Loads the configuration from the location specified by the parameter.
 * @param {string} pathToConfigFile The file name path to the configuration file.
 */
Config.prototype.loadConfig = function(pathToConfigFile) {

    assert.ok(is.nonEmptyStr(pathToConfigFile));

    if (!path.existsSync(pathToConfigFile))
        throw new Error('There is no file at "'+pathToConfigFile+'".');

    pathToConfigFile = path.resolve(pathToConfigFile);
    if (require.cache[pathToConfigFile])
        delete require.cache[pathToConfigFile];

    this.configObj = require(pathToConfigFile);
    if (!this.region && this.configObj && this.configObj.region)
        this.region = this.configObj.region;

    this.makeImmutableRecurse(this.configObj);
};

/**
 * Recursively make each property in the object immutable.
 * @param {object} obj An object for which to make immutable properties.
 */
Config.prototype.makeImmutableRecurse = function(obj) {

    if (!this.isObject(obj))
        return;

    for (var prop in obj) {
        if (this.isObject(prop))
            this.makeImmutableRecurse(prop);
        else
            this.makeImmutable(obj, prop);
    }
};

/**
 * Return the value associated with the specified property. If no such property is
 * found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.
 *
 * @param propertyName {string} The name of the property to look for. May include '.'
 * characters indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param defaultValue {string} A default value to use in case no property having propertyName
 * was found.
 * @return The value found, if no value is found, then the default value.
 */
Config.prototype.get = function(propertyName, defaultValue) {

    assert.ok(is.nonEmptyStr(propertyName));

    if ('string' !== typeof propertyName)
        return defaultValue || null;

    var properties = propertyName.split('.');
    var currVal = this.configObj;

    for (var i=0; i<properties.length; i++) {
        var currPropertyName = properties[i];
        if (!currVal.hasOwnProperty(currPropertyName))
            return defaultValue;
        currVal = currVal[currPropertyName];
    }

    var isValid = 'undefined'!==typeof currVal&&null!==currVal;
    return isValid ? currVal : defaultValue;
};

/**
 * Return the region-specific value associated with the specified property. If no such property is
 * found, the provided defaultValue will be returned or undefined if no defaultValue
 * was provided.  The region should be provided in the constructor to this object.
 *
 * If no region was specified when this object was created, the defaultValue will be returned.
 *
 * @param {string} propertyName The name of the property to look for. May include '.' characters
 * indicating an object traversal (e.g. 'parent.child.age', 'parent').
 * @param {string} defaultValue A default value to use in case no property having propertyName
 * was found.
 * @return The value found, if no value is found, then the default value.
 */
Config.prototype.getByRegion = function(propertyName, defaultValue) {

    assert.ok(is.nonEmptyStr(propertyName));
    if (this.region === undefined || propertyName === undefined)
        return defaultValue;

    propertyName = this.region + '.' + propertyName;
    return this.get(propertyName, defaultValue);
};

/**
 * <p>Make a configuration property immutable (assuring it cannot be changed
 * from the current value).</p>
 *
 * <p>
 * This operation cannot be un-done.
 * </p>
 * <p><i>
 *
 * This method was built for disabling runtime changes to configuration values,
 * but it can be applied to <u>any</u> javascript object.
 * </i></p>
 *
 * <p>Example:</p>
 * <pre>
 *   var CONFIG = require('config').customer;
 *   ...
 *
 *   // Obtain a DB connection using CONFIG parameters
 *   database.open(CONFIG.db.name, CONFIG.db.port);
 *   ...
 *
 *   // Don't allow database changes after connect
 *   CONFIG.makeImmutable(CONFIG.db, 'name');
 *   CONFIG.makeImmutable(CONFIG.db, 'port');
 * </pre>
 *
 * @method makeImmutable
 * @param object {object} - The object to attach an immutable property into.
 * @param property {string} - The name of the property to make immutable.
 * @param value {mixed} - (optional) Set the property value to this (otherwise leave alone)
 * @return object {object} - The original object is returned - for chaining.
 */
Config.prototype.makeImmutable = function(object, property, value) {

    assert.ok(is.object(object));
    assert.ok(is.nonEmptyStr(property));

    // Use the existing value if a new value isn't specified
    value = (typeof value === 'undefined') ? object[property] : value;

    // Disable writing, and make sure the property cannot be re-configured.
    Object.defineProperty(object, property, {
        value : value,
        writable : false,
        configurable: false
     });

    return object;
};
