# mush.js Style Guide

* Spaces, not tabs. (Definitely not mixed tabs and spaces.)
* Use 4-space indents. (I'm old, with poor vision.)
* Use JSDOC tags on all files, functions and methods. See: [jsdoc documentation](http://code.google.com/p/jsdoc-toolkit/wiki/TagReference "Link to jsdoc tags").
* If a function is longer than 50 lines, refactor it into smaller chunks.
* Variable names use camel case.
    * Anything created via `new` starts with a capital in the instance name.
    * Other objects and items start with a lowercase letter in the instance variable name.
* This project uses OOP however, keep objects simple. Very simple.
    * Not everything has to be an object.
    * Good candidates for objects are where related objects have a lot of common behavior but vary in a few ways.
* Always add `'use strict';` in your JS files.
* Avoid deeply nested asynchronous code by using the async module.
* Use jshint, if possible integrate it into your editor.
* KISS: Keep it simple, stupid.
* DRY: Don't repeat yourself.
* Validate your inputs: Make liberal use of assert & is to validate parameter types and values.
* Keep functions short, less than 50 lines, unless you have a good reason.
* Stick to under 110 columns

