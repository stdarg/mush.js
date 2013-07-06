# mush.js

### Intrduction
mush.js is a project to explore the idea of implementing a MUSH in JavaScript using node.js. Technically, it would only be MUSH-like in the commands. The in-game scripting langguage would be JavaScript (using node's virtual machine facility for security).

Right now, mush.js allows players to create, connect, say, pose, quit and use the who command. All commands are lowercase. It could be considered a chat-server with some persistence.

Currently, I am flushing out the data model for the objects and adding persistence for the objects. 

### Contributions
Right now I am working on this myself, but if the idea interests you, feel free to send pull requests. I ask that all contributions:

1. Stick to the style guide below
1. Achieve one thing per commit - keep it simple.

### Style Guide
* Place exports at the top of the file to make them easier to see.
* File names should be all lowercase - to prevent issues moving from case-insensitive to case-sensitive file systems.
* Spaces, not tabs for indentation so `git diff`, grep and cat output is readable.
    * Definitely not mixed tabs and spaces.
* Use 4-space indents - not everyone has perfect vision.
* Use JSDOC tags on all files, functions and methods. See: [jsdoc documentation](http://code.google.com/p/jsdoc-toolkit/wiki/TagReference "Link to jsdoc tags").
* If a function is longer than 50 lines, refactor it into smaller chunks.
* Variable names use camel case.
    * Anything created via `new` starts with a capital in the instance name.
    * Other objects and items start with a lowercase letter in the instance variable name.
* mush.js uses OOP however, keep objects simple. Very simple.
    * Not everything has to be an object.
    * Good candidates for objects are where related objects have a lot of common behavior but vary in a few ways.
* Always add `'use strict';` to the top of your JavaScript files.
* Avoid deeply nesting asynchronous code by using the async module.
    * Avoid nesting code more than 5 levels deep. Code gets harder to read the deeper you nest.
* Use jshint, if possible integrate it into your editor.
* KISS: Keep it simple, stupid.
* DRY: Don't repeat yourself.
* Validate your inputs: Make liberal use of assert & is to validate parameter types and values.
* Keep functions short, less than 50 lines, unless you have a good reason.
* Keep code lines under 110 columns

