# mush.js

A simple project to explore the idea of implementing a MUSH in node.js. Technically, it would only be MUSH-like, in the basic commands. The in-game scripting langguage would be JavaScript (using node's virtual machine facility for security).

Right now, it allows players to create, connect, say, pose, quit and use the who command. All commands are lowercase. 

Though primitive data persistence exists using mongodb, I am currently working on using mongoose to add full-featured object model persistance.
