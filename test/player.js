'use strict';
process.env.NODE_ENV = 'TEST';
require('../src/global_env')();
var Player = require('../src/player');
var player;

describe('Player', function() {
    before(function(done) {
        done();
    });

    it('constructor creates a guest player object in the player dir', function(done) {
        player = new Player();
        assert.ok(is.func(player.login));
        assert.ok(is.func(player.isConnected));
        assert.ok(is.func(player.isDisconnected));
        assert.ok(is.func(player.setFlag));
        assert.ok(is.func(player.getFlag));
        assert.ok(is.func(player.getTypeStr));
        assert.ok(is.func(player.loadFromDb));
        assert.ok(is.func(player.saveToDb));
        assert.ok(is.func(player.toJSON));
        done();
    });
});
