var Server = require('./Server.js').Server;

global.SpaceMud = new Server();
global.SpaceMud.start();
