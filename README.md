# mush.js

# Introduction
mush.js is a project to explore the idea of implementing a MUSH in JavaScript
using node.js. Technically, it would only be MUSH-like in the commands. The
in-game scripting langguage would be JavaScript (using node's virtual machine
facility for security).

Right now, mush.js allows players to login, talk and logout.  All commands are
lowercase. It could be considered a chat-server with some persistence.

Currently, I am flushing out the data model for the objects and adding
persistence for the objects.

# Supported Commands (so far)

## connect
connect \<playername\> \<password\>

Logs a player into the mush.

## create
create \<playername\> \<password\>

Creates a new player and logs them into the mush.

## describe
describe \<obj\>=\<text\>

Adds descriptive text to an object that is show when you type 'look'.

## look
look \<obj\>

Shows the object and its descriptive text.

## pose
pose \<text\>

Shows the player's name and some text following, e.g.

`pose smiles` results in: "Tangent smiles."

Alias ':', however no space needs to follow, e.g. `:smiles` results in "Tangent
smiles."

Alias: ';' again no space needs to follow and no space is shown. `;'s head
explodes` results in "Tangent's head explodes".

## say
say \<text\>

Shows the player's name with the text in quotes, e.g. `say hello`, results in
everyone but the player seeing, Tangent says "Hello.", while the player sees:
You say "Hello."

Alias '"', however no space needs to follow, e.g. `"Hello!` results in Tangent
says "Hello!"

## who
who

Shows who is online in a nicely formatted list.

## quit
quit

Logs the player out of the game.

# Warning
The code design is a bit ugly due to dependance on globals. It mirrors my vague
recollection of TinyMUSH which I'm using as model. The globals make the source
files interdependent, but my thought is, if the project is really worthwhile,
I'll take the time later and refactor it.

# Requirements
This project requires the following to be installed:

* [Node.js] (http://nodejs.org/ "The Node.js website")
* [LevelDB] (https://code.google.com/p/leveldb/ "Download LevelDB")

TinyMUSH used gdbm an embedded key/value store with a b-tree (if I recall
correctly). LevelDB is also an embedded key/value store, but uses a hash
instead.

# Running
To run the mush, do the following:

1. Change your directory to the mush.js directory, where the package.json
   resides: `cd ./mush.js`, then do the following steps in this directory.
2. Install the dependencies: `npm install`
3. Run the mush:  `node app.js`
4. Connect to the mush:  `telnet localhost 4201`
5. Login as God: `connect God potrzebie`

