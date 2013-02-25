/*!
 * Defines the Flags object which stores flags in a BitArray object. The FlagTable can be
 * thought as a static class member, there is 1 instance of it for the application and it
 * holds information that describes the flags.
 */
'use strict';

var assert = require('assert');
var util = require('util');
var is = require('is2');
var BitArray = require('BitArray').BitArray;

exports.Flags = Flags;

// FIXME: Add permission levels
// FIXME: Add function handlers: need actor, target
const FlagTable = {
    TRANSPARENT     : { pos: 0,  name: 'transparent',    letter: 't' };  // Can see through to the other side 
    WIZARD          : { pos: 1,  name: 'wizard',         letter: 'W' };  // gets automatic control 
    LINK_OK         : { pos: 2,  name: 'link_oK',        letter: 'L' };  // anybody can link to this room 
    DARK            : { pos: 3,  name: 'dark',           letter: 'D' };  // Don't show contents or presence 
    JUMP_OK         : { pos: 4,  name: 'jump_ok',        letter: 'J' };  // Others may @tel here 
    STICKY          : { pos: 5,  name: 'sticky',         letter: 'S' };  // Object goes home when dropped 
    DESTROY_OK      : { pos: 6,  name: 'destroy_ok',     letter: 'd' };  // Others may @destroy 
    HAVEN           : { pos: 7,  name: 'haven',          letter: 'H' };  // No killing here, or no pages 
    QUIET           : { pos: 8,  name: 'quiet',          letter: 'Q' };  // Prevent 'feelgood' messages 
    HALTED          : { pos: 9,  name: 'halted',         letter: 'h' };  // object cannot perform actions 
    TRACE           : { pos: 10, name: 'trace',          letter: 'T' };  // Generate evaluation trace output 
    GOING           : { pos: 11, name: 'going',          letter: 'G' };  // object is available for recycling 
    MONITOR         : { pos: 12, name: 'monitor',        letter: 'M' };  // Process ^x:action listens on obj? 
    MYOPIC          : { pos: 13, name: 'myopic',         letter: 'm' };  // See things as nonowner/nonwizard 
    PUPPET          : { pos: 14, name: 'puppet',         letter: 'p' };  // Relays ALL messages to owner 
    CHOWN_OK        : { pos: 15, name: 'chown_ok',       letter: 'C' };  // Object may be @chowned freely 
    ENTER_OK        : { pos: 16, name: 'enter_ok',       letter: 'e' };  // Object may be ENTERed 
    VISUAL          : { pos: 17, name: 'visual',         letter: 'V' };  // Everyone can see properties 
    IMMORTAL        : { pos: 18, name: 'immortal',       letter: 'i' };  // Object can't be killed 
    HAS_STARTUP     : { pos: 19, name: 'has_startup',    letter: '=' };  // Load some attrs at startup 
    OPAQUE          : { pos: 20, name: 'opaque',         letter: 'O' };  // Can't see inside 
    VERBOSE         : { pos: 21, name: 'verbose',        letter: 'v' };  // Tells owner everything it does. 
    INHERIT         : { pos: 22, name: 'inherit',        letter: 'I' };  // Gets owner's privs. (i.e. Wiz) 
    NOSPOOF         : { pos: 23, name: 'nospoof',        letter: 'N' };  // Report originator of all actions. 
    ROBOT           : { pos: 24, name: 'robot',          letter: 'r' };  // Player is a ROBOT 
    SAFE            : { pos: 25, name: 'safe',           letter: 's' };  // Need /override to @destroy 
    ROYALTY         : { pos: 26, name: 'royalty',        letter: 'Z' };  // Sees like a wiz, but ca't modify 
    AUDIBLE         : { pos: 27, name: 'audible',        letter: 'a' };  // Can hear out of this obj or exit 
    TERSE           : { pos: 28, name: 'terse',          letter: 'q' };  // Only show room name on look 
    KEY             : { pos: 29, name: 'key',            letter: 'K' };  // No puppets 
    ABODE           : { pos: 30, name: 'abode',          letter: 'A' };  // May @set home here 
    FLOATING        : { pos: 31, name: 'floating',       letter: '{' };  // -- Legacy -- 
    UNFINDABLE      : { pos: 32, name: 'unfindable',     letter: 'U' };  // Can't loc() from afar 
    PARENT_OK       : { pos: 33, name: 'parent_ok',      letter: 'Y' };  // Others may @parent to me 
    LIGHT           : { pos: 34, name: 'light',          letter: 'l' };  // Visible in dark places 
    HAS_LISTEN      : { pos: 35, name: 'has_listen',     letter: '@' };  // Internal: LISTEN attr set 
    HAS_FORWARDLIST : { pos: 36, name: 'has_forwardlist',letter: '&' };  // Internal: FORWARDLIST attr set 
    AUDITORIUM      : { pos: 37, name: 'auditorium',     letter: 'n' };  // Should we check the SpeechLock? 
    ANSI            : { pos: 38, name: 'ansi',           letter: 'X' };  
    HEAD            : { pos: 39, name: 'head',           letter: '?' }; 
    FIXED           : { pos: 40, name: 'fixed',          letter: 'f' }; 
    UNINSPECTED     : { pos: 41, name: 'uninspected',    letter: 'g' }; 
    ZONE            : { pos: 42, name: 'zone',           letter: 'o' };  // Check as local master room 
    DYNAMIC         : { pos: 43, name: 'dynamic',        letter: ';' }; 
    NOBLEED         : { pos: 44, name: 'nobleed',        letter: '-' }; 
    STAFF           : { pos: 45, name: 'staff',          letter: 'w' }; 
    HAS_DAILY       : { pos: 46, name: 'has_daily',      letter: '*' }; 
    GAGGED          : { pos: 47, name: 'gagged',         letter: 'g' }; 
    COMMANDS        : { pos: 48, name: 'commands',       letter: '$' };  // Check it for $commands 
    STOP            : { pos: 49, name: 'stop',           letter: '!' };  // Stop matching commands if found 
    BOUNCE          : { pos: 50, name: 'bounce',         letter: 'b' };  // Forward messages to contents 
    CONTROL_OK      : { pos: 51, name: 'control_ok',     letter: 'z' };  // ControlLk specifies who ctrls me 
    CONSTANT_ATTRS  : { pos: 52, name: 'constant_attrs', letter: 'k' };  // Can't set attrs on this object 
    VACATION        : { pos: 53, name: 'vacation',       letter: '|' }; 
    PLAYER_MAILS    : { pos: 54, name: 'player_mails',   letter: '`' };  // Mail message in progress 
    HTML            : { pos: 55, name: 'html',           letter: '~' };  // Player supports HTML 
    BLIND           : { pos: 56, name: 'blind',          letter: 'B' };  // Suppress has arrived / left msgs 
    SUSPECT         : { pos: 57, name: 'suspect',        letter: 'u' };  // Report some activities to wizards 
    WATCHER         : { pos: 58, name: 'watcher',        letter: '+' };  // Watch logins 
    CONNECTED       : { pos: 59, name: 'connected',      letter: 'c' };  // Player is connected 
    SLAVE           : { pos: 60, name: 'slave',          letter: 'x' };  // Disallow most commands 
    REDIR_OK        : { pos: 61, name: 'redir_ok',       letter: '>' };  // Can be victim of @redirect 
    HAS_REDIRECT    : { pos: 62, name: 'has_redir',      letter: '<' };  // Victim of @redirect 
    ORPHAN          : { pos: 63, name: 'orphan',         letter: 'y' };  // Don't check parent chain for $cmd 
    HAS_DARKLOCK    : { pos: 64, name: 'has_darklock',   letter: ',' };  // Has a DarkLock 
    DIRTY           : { pos: 65, name: 'dirty',          letter: ''  };  // Temporary flag: object is dirty 
    FREE            : { pos: 66, name: 'free',           letter: 'F' };  // Not subject to attr defaults 
    PRESENCE        : { pos: 67, name: 'presence',       letter: '^' };  // Check presence-related locks 
    HAS_SPEECHMOD   : { pos: 68, name: 'has_speechmod',  letter: '"' };  // Check @speechmod attr 
    HAS_PROPDIR     : { pos: 69, name: 'has_propdir',    letter: ',' };  // Internal: has Propdir attr 
    MARKER0         : { pos: 70, name: 'mark_0',         letter: '0' };  // User-defined flags 
    MARKER1         : { pos: 71, name: 'mark_1',         letter: '1' }; 
    MARKER2         : { pos: 72, name: 'mark_2',         letter: '2' }; 
    MARKER3         : { pos: 73, name: 'mark_3',         letter: '3' }; 
    MARKER4         : { pos: 74, name: 'mark_4',         letter: '4' }; 
    MARKER5         : { pos: 75, name: 'mark_5',         letter: '5' }; 
    MARKER6         : { pos: 76, name: 'mark_6',         letter: '6' }; 
    MARKER7         : { pos: 77, name: 'mark_7',         letter: '7' }; 
    MARKER8         : { pos: 78, name: 'mark_8',         letter: '8' }; 
    MARKER9         : { pos: 79, name: 'mark_9',         letter: '9' }; 
};

const numFlags = Object.keys(FlagTable).length;
assert(numFlags === FlagTable.MARKER9.pos+1);

function Flags() {
    this.flagArray = new BitArray(numFlags);
}

Flags.prototype.get = function(flagName) {
    assert.ok(is.nonEmptyStr(flagName));
    assert.ok(FlagTable[flagName] !== undefined);
    var val = this.flagArray.get(FlagTable[flagName].pos);
    return val;
};

Flags.prototype.set = function(flagName, flagValue) {
    assert.ok(is.nonEmptyStr(flagName));
    assert.ok(FlagTable[flagName] !== undefined);
    assert.ok(is.int(flagValue) && (val === 0 || val === 1));
    this.flagArray.set(FlagTable[flagName].pos, flagValue);
};

Flags.prototype.getFlagStr = function() {
    var flagStr = '';
    for (var flagName in FlagTable) {
        if (this.flagArray.get(FlagTable[flagName].pos) === 1)
            flagStr += FlagTable[flagName].letter;
    }
    return flagStr;
};
