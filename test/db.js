'use strict';
process.env.NODE_ENV = 'TEST';
var fs = require('fs');
require('../src/global_env');
var Db = require('../src/db').Db;
var rmdir = require( 'rmdir' );
var DB;
var dbName = './test.db';

describe('Db', function() {
    before(function(done) {
        if (fs.existsSync(dbName)) {
            rmdir(dbName, function(err) {
                done(err);
            });
        } else {
            done();
        }
    });

    it('constructor creates a db and returns the Db object in the callback', function(done) {
        DB = new Db(dbName, function(err, dbObj) {
            if (err)  return done(err);
            assert.ok(is.nonEmptyObj(dbObj));
            assert.ok(fs.existsSync(dbName));
            return done(err);
        });
    });

    var obj = {id:'1',a:'alpha',b:2,c:true,d:{e:'epsilson'}};
    it('put should place data into the db with a given key', function(done) {
        DB.put(obj, function(err) {
            done(err);
        });
    });

    it('get should retrieve data from the db with a given key', function(done) {
        DB.get(obj.id, function(err, val) {
            if (err)  return done(err);
            assert.deepEqual(obj,val);
            done();
        });
    });

    it('del should remove the data from the db for a given key', function(done) {
        DB.del(obj.id, function(err) {
            done(err);
        });
    });

    it('get should NOT retrieve data from the db after it is deleted', function(done) {
        DB.get(obj.id, function(err) {
            if (err && err.message === 'Key not found in database [1]') {
                return done();
            }
            done(new Error('get should have failed.'));
        });
    });


    it('close should close the db', function(done) {
        DB.close(function(err) {
            assert.ok(DB.db.isClosed());
            done(err);
        });
    });

    after(function(done) {
        if (fs.existsSync(dbName)) {
            rmdir(dbName, function(err) {
                done(err);
            });
        } else {
            done();
        }
    });
});
