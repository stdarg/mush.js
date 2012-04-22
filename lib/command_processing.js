var util = require('util');


exports.CommandQueue = function () {
	var instance = (function() {

		// private data
		var cmdQueue = [];

		// private methods
		function processQue() {
			if (cmdQueue.length === 0) return;
			var cmdEntry = cmdQueue.pop();
			console.log('run! ' + cmdEntry.cmd);
			parseCommand(cmdEntry);

			if (cmdQueue.length)
				setTimeout(run(), 50);
		}

		function parseAtCmds(cmdEntry) {
		}

		function doCmdSay(cmdEntry) {
			var name = cmdEntry.conn.player.name;
			var output = name + ' says "' + cmdEntry.cmdStr.slice(1) + '"\n';
			console.log(output);
			global.SpaceMud.queCmdOutput(cmdEntry, output);
		}

		function doCmdPose(cmdEntry, addSpace) {
		}

		function parseCommand(cmdEntry) {
			var noPrefixSpace = true;
			console.log('parseCmd ' + cmdEntry.cmd[0]);
			cmdEntry.cmdStr = cmdEntry.cmd.toString('utf8');

			switch (cmdEntry.cmdStr[0]) {
				case '@':
					paseAtCmds(cmdEntry);
					break;
				case '"':
				case '\'':
					console.log('Say!');
					doCmdSay(cmdEntry);
					break;
				case ':':
					doCmdPose(cmdEntry);
					break;
				case ';':
					doCmdPose(cmdEntry, noPrefixSpace);
					break;
			}
		}

		// public interface
		return { 
			queCmd: function(conn, cmd) {
				var cmdEntry = {};
				cmdEntry.conn = conn;
				cmdEntry.cmd = cmd;
				cmdQueue.push(cmdEntry);
				console.log('cmdQueue.length: '+cmdQueue.length);
				if (cmdQueue.length == 1)
					setTimeout(processQue, 10);
			}
		};
	})();

	CommandQueue = function() {
		return instance;
	};

	return CommandQueue();
};
