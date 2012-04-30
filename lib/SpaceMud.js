var Server = require('./Server').Server;

global.SpaceMud = new Server();
global.SpaceMud.start();
