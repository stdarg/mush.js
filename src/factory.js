/**
 * @fileOverview
 * Given raw obj from the db, constructs the correct game object type.
 */

'use strict';
var Obj = require('./object');
var Player = require('./player');
var Room = require('./room');
var Exit = require('./exit');

var FactoryInst;

module.exports = function() {
    if (FactoryInst)
        return FactoryInst;
    FactoryInst = new Factory();
    return FactoryInst;
};

/**
 * Factory constructor
 */
function Factory() {
}

/**
 * Factory to create game objects from JSON representation in db.
 * @param {Object} obj DB object representation.
 * @return {Object} The game object, i.e. exit, player, object or room.
 */
Factory.prototype.load = function(obj) {
    var self = this;
    assert.ok(is.nonEmptyObj(obj));
    assert.ok(is.nonEmptyStr(obj.type));
    var gameObj;
    switch (obj.type) {
        case 'e':
            gameObj = self.loadExit(obj);
            break;
        case 'p':
            gameObj = self.loadPlayer(obj);
            break;
        case 'o':
            gameObj = self.loadObj(obj);
            break;
        case 'r':
            gameObj = self.loadRoom(obj);
            break;
        default:
            throw new Error('Factory received unknown type: '+obj.type);
    }
    return gameObj;
};

/**
 * Load an exit object.
 * @param {Object} obj DB object representation.
 * @return {Exit} An object of type Exit.
 */
Factory.prototype.loadExit = function(obj) {
    return new Exit(obj);
};

/**
 * Load a player object.
 * @param {Object} obj DB object representation.
 * @return {Player} An object of type Player.
 */
Factory.prototype.loadPlayer = function(obj) {
    return new Player(obj);
};

/**
 * Load an object object.
 * @param {Object} obj DB object representation.
 * @return {Obj} An object of type Obj.
 */
Factory.prototype.loadObj = function(obj) {
    return new Obj(obj);
};

/**
 * Load a room object.
 * @param {Object} obj DB object representation.
 * @return {Room} An object of type Room.
 */
Factory.prototype.loadRoom = function(obj) {
    return new Room(obj);
};

Factory.prototype.createObj = function(name, ownerId, cb) {
    assert.ok(is.nonEmptyStr(name));
    assert.ok(mush.db.validId(ownerId));
    assert.ok(is.func(cb));

    var obj = {};                // create new player obj
    obj.name = name;       // add default data
    obj.cdate = new Date();
    obj.sex = 'n';
    obj.desc = 'You see a little something.';
    obj.id = mush.db.getNextId();
    obj.owner = ownerId;
    // FIXME: Have a definition of where the start room is.
    obj.loc = ownerId;

    mush.db.put(obj, function(err) {
        if (err) {
            mush_utils.logErr(err);
            return cb(err);
        }

        log.info('Created object: %s(#%d)\n%j', name, obj.id, obj);
        cb(null, obj);
    });
};

/**
 * Create a player object.
 * @param {Object} obj DB object representation.
 * @return {Player} An object of type Player.
 */
Factory.prototype.playerFromDbObj = function(playerObj, cb) {
    var self = this;
    log.warn('Obj: %j', playerObj);
    assert.ok(is.nonEmptyObj(playerObj));
    assert.ok(is.func(cb));
    assert.ok(is.nonEmptyStr(playerObj.name));
    assert.ok(is.nonEmptyStr(playerObj.hash));
    assert.ok(mush_utils.validId(playerObj.id));

    mush.db.put(playerObj, function(err) {
        if (err) {
            mush_utils.logErr(err);
            return cb(err);
        }

        var Player = self.loadPlayer(playerObj);

        log.info('Created player: %s(#%d)\n%j', Player.name, Player.id, Player);
        cb(null, Player);
    });
};

/**
 * Create a new player object.
 * @param {String} playerName The name of the new player.
 * @return {String} hash The player password.
 */
Factory.prototype.createNewPlayer = function(playerName, hash, cb) {
    var self = this;
    assert.ok(is.nonEmptyStr(playerName));
    assert.ok(is.nonEmptyStr(hash));
    assert.ok(is.func(cb));

    var player = {};                // create new player obj
    player.name = playerName;       // add default data
    player.cdate = new Date();
    player.hash = hash;
    player.sex = 'n';
    player.last = player.cdate;
    player.desc = 'You see someone with many possibilities.';
    player.id = mush.db.getNextId();
    player.owner = player.id;
    player.loc = 0;

    mush.db.put(player, function(err) {
        if (err) {
            mush_utils.logErr(err);
            return cb(err);
        }

        var PlayerObj = self.loadPlayer(player);

        log.info('Created player: %s(#%d)\n%j', player.name, player.id, player);
        cb(null, PlayerObj);
    });
};

/**
 * Create the first room in the game #0.
 * @param {Function} cb Callback of type fn(err);
 */
Factory.prototype.createGod =  function(cb) {
    var god = {
        id: mush.db.getNextId(),
        name: 'God',
        type: 'p',
        flags: 0,
        desc: 'You see the embodiment of the cosmos.',
        CREATED: Date.now(),
        loc: '0',
        hash: mush_utils.createHash('potrzebie')
    };
    god.owner = god.id;
    assert.ok(god.id === '1');
    var PlayerType = require('./player');
    var player = new PlayerType(god);
    assert.ok(player instanceof PlayerType);
    player.saveToDb(cb);
};

/**
 * Creates the first player in the game #1
 * @param {Function} cb Callback of type fn(err);
 */
Factory.prototype.createTheVoid = function(cb) {
    var theVoid = {
        id: mush.db.getNextId(),
        name: 'The Void',
        type: 'r',
        flags: 0,
        desc: 'You stand at the precipice of creation upon an '+
              'intersection of countless possibilities.',
        owner: '1',
        CREATED: Date.now()
    };
    assert.ok(theVoid.id === '0');
    mush.db.put(theVoid, function(err) {
        if (err)  mush_utils.logErr(err);
        cb(err);
    });
};

