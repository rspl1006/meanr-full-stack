var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
  express = require('express'),
  http = require('http'),
  config = require('./config/config'),
  passport = require('passport'),
  logger = require('./config/log'),
  socketio = require('socket.io'),
  requireWalk = require('./www/utils/requireWalk').requireWalk;

// Expressjs setup
var app = express();

// Mongodb and Mongoose setup and configs
require('./config/mongodb');

//bootstrap passport config
require('./config/passport')(passport);

// Expressjs configs
require('./config/express')(app, passport);

// Expressjs routes
var requireRoutes = requireWalk(config.get('root') + '/www/routes');
requireRoutes(config, app, passport);

// Start web server
var server = http.createServer(app).listen(app.get('port'), function () {
  msg = 'Express server listening on port  ' + app.get('port') + ' in ' + env + ' mode';
  logger.info(msg);
});

socketio.listen(server).on('connection', function (socket) {
    socket.on('message', function (msg) {
        console.log('Message Received: ', msg);
        socket.broadcast.emit('message', msg);
    });
});
