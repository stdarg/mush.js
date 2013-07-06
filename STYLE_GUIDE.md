Style Guide
===========

* Spaces, not tabs. (Definiately not mixed tabs and spaces.)
* 4-space indents, not 2 or 3 or 1. (I'm old, with poor vision.)
* Use JSDOC tags on all files, functions and methods. See: http://code.google.com/p/jsdoc-toolkit/wiki/TagReference
* If a function is longer than 60 lines, refactor it into smaller chunks.
* Variable names use camel case.
** Anything created via `new` starts with a capital in the instance name.
* This project uses OOP, keep objects simple. Very simple.
** Not everything has to be an object, however.
** Good candidates for objects are where related objects have a lot of common behavior but vary in a few ways.
* Always add 'use strict'; in your JS files.
* Avoid deeply nested asynchronous code by using functional decomposition and the async module.
* Use jshint
* KISS: Keep it simple, stupid.
* DRY: Don't repeat yourself.
* Validate your inputs: Make liberal use of assert & is to validate parameter types.
