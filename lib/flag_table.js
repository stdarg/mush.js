/**
 * @fileOverview
 * FlagsTable.js has a const object defining all the flags.
 */

'use strict';   // for const!

// FIXME: Add permission levels
exports.flags = {
    transparent     : { pos: 0,  name: 'transparent',    letter: 't' },  // Can see through to the other side
    wizard          : { pos: 1,  name: 'wizard',         letter: 'W' },  // gets automatic control
    link_ok         : { pos: 2,  name: 'link_oK',        letter: 'L' },  // anybody can link to this room
    dark            : { pos: 3,  name: 'dark',           letter: 'D' },  // Don't show contents or presence
    jump_ok         : { pos: 4,  name: 'jump_ok',        letter: 'J' },  // Others may @tel here
    sticky          : { pos: 5,  name: 'sticky',         letter: 'S' },  // Object goes home when dropped
    destroy_ok      : { pos: 6,  name: 'destroy_ok',     letter: 'd' },  // Others may @destroy
    haven           : { pos: 7,  name: 'haven',          letter: 'H' },  // No killing here, or no pages
    quiet           : { pos: 8,  name: 'quiet',          letter: 'Q' },  // Prevent 'feelgood' messages
    halted          : { pos: 9,  name: 'halted',         letter: 'h' },  // object cannot perform actions
    trace           : { pos: 10, name: 'trace',          letter: 'T' },  // Generate evaluation trace output
    going           : { pos: 11, name: 'going',          letter: 'G' },  // object is available for recycling
    monitor         : { pos: 12, name: 'monitor',        letter: 'M' },  // Process ^x:action listens on obj?
    myopic          : { pos: 13, name: 'myopic',         letter: 'm' },  // See things as nonowner/nonwizard
    puppet          : { pos: 14, name: 'puppet',         letter: 'p' },  // Relays ALL messages to owner
    chown_ok        : { pos: 15, name: 'chown_ok',       letter: 'C' },  // Object may be @chowned freely
    enter_ok        : { pos: 16, name: 'enter_ok',       letter: 'e' },  // Object may be ENTERed
    visual          : { pos: 17, name: 'visual',         letter: 'V' },  // Everyone can see properties
    immortal        : { pos: 18, name: 'immortal',       letter: 'i' },  // Object can't be killed
    has_startup     : { pos: 19, name: 'has_startup',    letter: '=' },  // Load some attrs at startup
    opaque          : { pos: 20, name: 'opaque',         letter: 'O' },  // Can't see inside
    verbose         : { pos: 21, name: 'verbose',        letter: 'v' },  // Tells owner everything it does.
    inherit         : { pos: 22, name: 'inherit',        letter: 'I' },  // Gets owner's privs. (i.e. Wiz)
    nospoof         : { pos: 23, name: 'nospoof',        letter: 'N' },  // Report originator of all actions.
    robot           : { pos: 24, name: 'robot',          letter: 'r' },  // Player is a ROBOT
    safe            : { pos: 25, name: 'safe',           letter: 's' },  // Need /override to @destroy
    royalty         : { pos: 26, name: 'royalty',        letter: 'Z' },  // Sees like a wiz, but ca't modify
    audible         : { pos: 27, name: 'audible',        letter: 'a' },  // Can hear out of this obj or exit
    terse           : { pos: 28, name: 'terse',          letter: 'q' },  // Only show room name on look
    key             : { pos: 29, name: 'key',            letter: 'K' },  // No puppets
    abode           : { pos: 30, name: 'abode',          letter: 'A' },  // May @set home here
    floating        : { pos: 31, name: 'floating',       letter: '{' },  // -- Legacy --
    unfindable      : { pos: 32, name: 'unfindable',     letter: 'U' },  // Can't loc() from afar
    parent_ok       : { pos: 33, name: 'parent_ok',      letter: 'Y' },  // Others may @parent to me
    light           : { pos: 34, name: 'light',          letter: 'l' },  // Visible in dark places
    has_listen      : { pos: 35, name: 'has_listen',     letter: '@' },  // Internal: LISTEN attr set
    has_forwardlist : { pos: 36, name: 'has_forwardlist',letter: '&' },  // Internal: FORWARDLIST attr set
    auditorium      : { pos: 37, name: 'auditorium',     letter: 'n' },  // Should we check the SpeechLock?
    ansi            : { pos: 38, name: 'ansi',           letter: 'X' },
    head            : { pos: 39, name: 'head',           letter: '?' },
    fixed           : { pos: 40, name: 'fixed',          letter: 'f' },
    uninspected     : { pos: 41, name: 'uninspected',    letter: 'g' },
    zone            : { pos: 42, name: 'zone',           letter: 'o' },  // Check as local master room
    dynamic         : { pos: 43, name: 'dynamic',        letter: ';' },
    nobleed         : { pos: 44, name: 'nobleed',        letter: '-' },
    staff           : { pos: 45, name: 'staff',          letter: 'w' },
    has_daily       : { pos: 46, name: 'has_daily',      letter: '*' },
    gagged          : { pos: 47, name: 'gagged',         letter: 'g' },
    commands        : { pos: 48, name: 'commands',       letter: '$' },  // Check it for $commands
    stop            : { pos: 49, name: 'stop',           letter: '!' },  // Stop matching commands if found
    bounce          : { pos: 50, name: 'bounce',         letter: 'b' },  // Forward messages to contents
    control_ok      : { pos: 51, name: 'control_ok',     letter: 'z' },  // ControlLk specifies who ctrls me
    constant_attrs  : { pos: 52, name: 'constant_attrs', letter: 'k' },  // Can't set attrs on this object
    vacation        : { pos: 53, name: 'vacation',       letter: '|' },
    player_mails    : { pos: 54, name: 'player_mails',   letter: '`' },  // Mail message in progress
    html            : { pos: 55, name: 'html',           letter: '~' },  // Player supports HTML
    blind           : { pos: 56, name: 'blind',          letter: 'B' },  // Suppress has arrived / left msgs
    suspect         : { pos: 57, name: 'suspect',        letter: 'u' },  // Report some activities to wizards
    watcher         : { pos: 58, name: 'watcher',        letter: '+' },  // Watch logins
    connected       : { pos: 59, name: 'connected',      letter: 'c' },  // Player is connected
    slave           : { pos: 60, name: 'slave',          letter: 'x' },  // Disallow most commands
    redir_ok        : { pos: 61, name: 'redir_ok',       letter: '>' },  // Can be victim of @redirect
    has_redirect    : { pos: 62, name: 'has_redir',      letter: '<' },  // Victim of @redirect
    orphan          : { pos: 63, name: 'orphan',         letter: 'y' },  // Don't check parent chain for $cmd
    has_darklock    : { pos: 64, name: 'has_darklock',   letter: ',' },  // Has a DarkLock
    dirty           : { pos: 65, name: 'dirty',          letter: ''  },  // Temporary flag: object is dirty
    free            : { pos: 66, name: 'free',           letter: 'F' },  // Not subject to attr defaults
    presence        : { pos: 67, name: 'presence',       letter: '^' },  // Check presence-related locks
    has_speechmod   : { pos: 68, name: 'has_speechmod',  letter: '"' },  // Check @speechmod attr
    has_propdir     : { pos: 69, name: 'has_propdir',    letter: ',' },  // Internal: has Propdir attr
    marker0         : { pos: 70, name: 'mark_0',         letter: '0' },  // User-defined flags
    marker1         : { pos: 71, name: 'mark_1',         letter: '1' },
    marker2         : { pos: 72, name: 'mark_2',         letter: '2' },
    marker3         : { pos: 73, name: 'mark_3',         letter: '3' },
    marker4         : { pos: 74, name: 'mark_4',         letter: '4' },
    marker5         : { pos: 75, name: 'mark_5',         letter: '5' },
    marker6         : { pos: 76, name: 'mark_6',         letter: '6' },
    marker7         : { pos: 77, name: 'mark_7',         letter: '7' },
    marker8         : { pos: 78, name: 'mark_8',         letter: '8' },
    marker9         : { pos: 79, name: 'mark_9',         letter: '9' },
};

exports.num = Object.keys(exports.flags).length;