# mush.js

# Introduction
mush.js is a project to explore the idea of implementing a MUSH in JavaScript
using node.js. Technically, it would only be MUSH-like in the commands. The
in-game scripting langguage would be JavaScript (using node's virtual machine
facility for security).

Right now, mush.js allows players to create, connect, say, pose, quit and use
the who command. All commands are lowercase. It could be considered a
chat-server with some persistence.

Currently, I am flushing out the data model for the objects and adding
persistence for the objects.

# Warning
The code design is a bit ... ugly due to a dependance on globals. It mirrors my
vague recollection of TinyMUSH which I'm using as model. The globals make it the
source files interdependent, but my thought is, if the project is really
worthwhile, I'll take the time later and refactor it.

# Requirements
This project requires the following to be installed:

* [Node.js] (http://nodejs.org/ "The Node.js website")
* [LevelDB] (https://code.google.com/p/leveldb/ "Download LevelDB")

# Running
To run the mush, do the following:

1. Change your directory to the mush.js directory, where the package.json
   resides: `cd ./mush.js`, then do the following steps in this directory.
2. Install the dependencies: `npm install`
3. Run the mush:  `node app.js`
4. Connect to the mush:  `telnet localhost 4201`
5. Login as God: `connect God potrzebie`


