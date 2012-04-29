var util = require('util');

exports.CommandQueue = CommandQueue;

function CommandQueue() {
    // private data
    this.cmdQueue = [];
};

// private methods
CommandQueue.prototype.processQue = function() {
    if (this.cmdQueue.length === 0)
        return;

    var cmdEntry = this.cmdQueue.pop();
    this.parseCommand(cmdEntry);
    var self = this;

    if (this.cmdQueue.length)
        process.nextTick(function() {self.processQue();});
};

CommandQueue.prototype.parseAtCmds = function(cmdEntry) {
};

CommandQueue.prototype.doCmdSay = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + ' says "' + cmdEntry.cmdStr.slice(1) + '"';
    console.log(output);
    global.SpaceMud.queCmdOutput(cmdEntry, output);
};

CommandQueue.prototype.doCmdPose = function(cmdEntry, addSpace) {
    var output = cmdEntry.conn.player.name + 
        (addSpace ? ' ' : '') + cmdEntry.cmdStr.slice(1);
    console.log(output);
    global.SpaceMud.queCmdOutput(cmdEntry, output);
};

CommandQueue.prototype.playerQuit = function(cmdEntry) {
    var output = cmdEntry.conn.player.name + ' has logged out.';
    console.log(output);
    cmdEntry.conn.socket.end();
};

CommandQueue.prototype.showWhoIsOnline = function(cmdEntry) {
    var output = 'Players currently online:\n';
    for (conn in global.SpaceMud.ConnectionList) {
        output += util.format('%s %d sec\n', 
                              global.SpaceMud.ConnectionList[conn].player.name,
                              global.SpaceMud.ConnectionList[conn].timeOnlineSecs());
    }
    cmdEntry.conn.socket.write(output);
};

CommandQueue.prototype.parseCommand = function(cmdEntry) {
    var noPrefixSpace = true;
    cmdEntry.cmdStr = cmdEntry.cmd.toString('utf8');

    switch (cmdEntry.cmdStr[0]) {
        case '@':
            this.paseAtCmds(cmdEntry);
            break;
        case '"':
        case '\'':
            this.doCmdSay(cmdEntry);
            break;
        case ':':
            this.doCmdPose(cmdEntry, noPrefixSpace);
            break;
        case ';':
            this.doCmdPose(cmdEntry);
            break;
        case 'Q':
            this.playerQuit(cmdEntry);
            break;
        case 'W':
            this.showWhoIsOnline(cmdEntry);
            break;
    }
};

CommandQueue.prototype.queCmd = function(conn, cmd) {
    var cmdEntry = {};
    cmdEntry.conn = conn;
    cmdEntry.cmd = cmd;
    this.cmdQueue.push(cmdEntry);
    var self = this;
    if (this.cmdQueue.length)
        process.nextTick(function() {self.processQue();});
};
