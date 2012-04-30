var util = require('util');

exports.Commands = Commands;

function Commands() {}

Commands.prototype.isValidCmd = function(cmd) {
    if (this.table[cmd] === undefined)
        return false;
    return true;
};

Commands.prototype._error = function(cmdEntry) {
    var output = '"'+cmdEntry.cmdStr+'" is not a valid command.' ;
    cmdEntry.conn.socket.write(output);
};

Commands.prototype.say = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + ' says "' + cmdEntry.cmdStr + '"';
    global.SpaceMud.queCmdOutput(cmdEntry, output);
};

Commands.prototype.pose = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + 
        (cmdEntry.poseWithSpace ? ' ' : '') + cmdEntry.cmdStr;
    global.SpaceMud.queCmdOutput(cmdEntry, output);
};

Commands.prototype.quit = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + ' has logged out.';
    global.SpaceMud.queCmdOutput(cmdEntry, output);
    cmdEntry.conn.socket.end();
};

Commands.prototype.who = function(cmdEntry) {
    var output = 'Players currently online:\n';
    for (conn in global.SpaceMud.ConnectionList) {
        output += util.format('%s %d sec\n', 
                              global.SpaceMud.ConnectionList[conn].player.name,
                              global.SpaceMud.ConnectionList[conn].timeOnlineSecs());
    }
    cmdEntry.conn.socket.write(output);
};
