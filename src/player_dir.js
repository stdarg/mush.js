/**
 * @fileOverview
 * A hash of players where the key is the player name and the value is the player obj.
 */
'use strict';
var PlayerObj = require('./player');
var PlayerDirInst;

module.exports = function() {
    if (PlayerDirInst)
        return PlayerDirInst;
    PlayerDirInst = new PlayerDir();
    return PlayerDirInst;
};

function PlayerDir() {
    var self = this;
    self.hash = {};
}

PlayerDir.prototype.add = function(Player) {
    var self = this;
    assert.ok(is.instOf(Player, PlayerObj));
    assert.ok(is.nonEmptyStr(Player.name));
    assert.ok(is.obj(self.hash));
    self.hash[Player.name] = Player;
};


PlayerDir.prototype.rm = function(Player) {
    var self = this;
    assert.ok(is.instOf(Player, PlayerObj));
    assert.ok(is.nonEmptyStr(Player.name));
    assert.ok(is.obj(self.hash));
    assert.ok(is.obj(self.hash[Player.name]));
    delete self.hash[Player.name];
};


PlayerDir.prototype.get = function(playerName) {
    var self = this;
    log.warn('playerName "%s"',playerName);
    log.warn('hash %j',self.hash);
    assert.ok(is.nonEmptyStr(playerName));
    assert.ok(is.obj(self.hash));
    log.warn('self.hash[%s]=%j',playerName, self.hash[playerName]);
    return self.hash[playerName];
};

