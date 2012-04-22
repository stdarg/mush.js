var Server = require('./server.js').Server;

global.SpaceMud = new Server();
global.SpaceMud.start();
