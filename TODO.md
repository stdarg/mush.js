# TODO LIST

* Move object properties from Player.js to Object.js
* Make Player.js inherit from Object.js
* Make Room.js (and have it inherit from Object.js)
* Make Exit.js (and have it inherit from Object.js)
* Create a base object to share functionality common to players, objects and rooms.
* Clean up player object, add methods.
* When player logs in, load location, location's inventory.
* When player logs in, show room desc, exits, and inventory.
* Set up indicies on Mongo collections by id and owner.
* Create Flag Object - 32 bits - find bit array object.
* Place error strings in en-us.js config file.
* Keep all MongoDB functionality to Db.js
* in Objects.js create an in-memory and on-disk representation
* In Players.js create an on-disk representation.
* Consider alternative to mongoDB
    * perhaps something netirely node-based?
    * Maybe LevelDB
