'use strict';

module.exports = function (config, app) {

  var devices = require(config.get('root') + '/www/controllers/devices');

  var auth = require(config.get('root') + '/www/middlewares/authorization');

  // URL Parameter Rules

  // device id
  app.param('deviceId', /^[0-9a-fA-F]{24}$/);

  // JSON API

  app.get('/api/v1/devices', devices.all);

  app.get('/api/v1/devices/:deviceId', devices.show);

  app.post('/api/v1/devices', auth.requiresLogin, devices.create);

  app.put('/api/v1/devices/:deviceId', auth.requiresLogin, auth.device.hasAuthorization, devices.update);

  app.del('/api/v1/devices/:deviceId', devices.destroy);

  // Secure AngularJS templates

  app.get('/devices/create', auth.requiresLogin, function (req, res) {
    res.render('devices/create.html');
  });

  app.get('/devices/edit', auth.requiresLogin, function (req, res) {
    res.render('devices/edit.html');
  });

};
