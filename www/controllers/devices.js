'use strict';

// Devices JSON only API

// Import required modules
var config = require('../../config/config'),
  logger = require(config.get('root') + '/config/log'),
  q = require('q'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  Device = mongoose.model('Device');
  
 
exports.runpython = function (req, res) {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
    
     var PythonShell = require('python-shell');
//     console.log('D:\angular\meanr\meanr-full-stack\podlink.py');
var shell = PythonShell.run('podlink.py');
    res.jsonp({data:null});
};
// Utility promise object find one Device
var findOneDevice = function (id) {

  var deferred = q.defer();

  Device.load(id, function (err, device) {

    // Error message for:
    // * database error
    // * not found device
    var msg = 'Sorry we are unable to find this device';

    if (err) {
      // @user message
      deferred.reject(msg);

      // @systemsadmin message
      logger.error(err.toString());
      //logger.error(err.stack);
    }
    if (!device) {
      // @user message
      deferred.reject(msg);

      // @systemsadmin message
      logger.error('Unable to find device ' + id);
    }
    else {
      // @user message
      deferred.resolve(device);

      // @systemsadmin message
      logger.info('Found device ' + id);
    }
  });

  return deferred.promise;
};

// Utility promise destroy one Device
var destroyDevice = function (device) {

  var deferred = q.defer();

  device.remove(function (err) {
    if (err) {
      // @systemsadmin message
      logger.error(err.toString());
      // @user message
      deferred.reject('Sorry but we are unable to remove this device, please try again.');

    } else {
      // @systemsadmin message
      logger.info('Destroyed device ' + device._id);

      // @user message
      deferred.resolve();
    }
  });

  return deferred.promise;
};

// List of Devices
exports.all = function (req, res) {
  Device.find().sort('-created_at').exec(function (err, devices) {
    if (err) {
      // @systemsadmin message
      logger.error(err.toString());
      // @user message
      var msg = 'Sorry we have a problem finding all devices';
      logger.error(msg);
      res.jsonp(500, {error: msg});
    } else {
      // @user message
      res.jsonp(devices);
    }
  });
};

//Create a Device
exports.create = function (req, res) {
    
  // @systemsadmin message
  logger.log('info', 'POST: %j', req.body, {});

  var device = new Device(req.body);

  device.user = req.user;

  device.save(function (err) {
    if (err) {
      // @systemsadmin message
      logger.error(err.toString());

      // @user message
      var errorResponse;

      // respond with model validation errors if they exist or else respond to database errors with generic message
      if (err.errors) {
        errorResponse = err.errors;
      }
      else {
        errorResponse = {error: 'Sorry but we are unable to save this record, please try again.'};
      }

      res.jsonp(400, errorResponse);

    }
    else {
      // @systemsadmin message
      var msg = 'Created device ' + device._id;
      logger.info(msg);
      res.jsonp(201, device);
    }
  });
};

// Show an shareride
exports.show = function (req, res) {

  // Logging is done inside the promise object
  findOneDevice(req.params.deviceId)
    .then(
    function (device) {
      res.jsonp(200, device);
    },
    function (err) {
      res.jsonp(200, {error: err});
    }
  )
    .done();

};

// Destroy a shareride
exports.destroy = function (req, res) {

  // @systemadmin logging is done inside the promise object
  // Only the @user error message needs to be logged here
  return findOneDevice(req.params.deviceId)
    .then(function (device) {
      return destroyDevice(device);
    })
    .then(
    function () {
      res.send(204);
    },
    function (err) {
      // @user message
      logger.error(err);
      res.jsonp(200, {error: err});
    }
  );

};

// Utility promise save one Ridesahre
var saveDevicePromise = function (device) {

  var deferred = q.defer();

  device.save(function (err) {

    if (err) {

      // @systemsadmin message
      logger.error(err.toString());

      // @user message
      var errorResponse;

      if (err.errors) {
        // respond to model validation errors if they exist
        errorResponse = err.errors;
      }
      else {
        // else respond to database errors with generic message
        errorResponse = {error: 'Sorry but we are unable to save this record, please try again.'};
      }

      // @user message
      deferred.reject(errorResponse);

    } else {

      // @systemsadmin message
      var msg = 'Saved device ' + device._id;
      logger.info(msg);

      // @user message
      deferred.resolve();
    }

  });

  return deferred.promise;
};

// Update a device
exports.update = function (req, res) {
  // @systemsadmin message
  logger.info('PUT: ' + req.params.deviceId.toString());
  logger.log('info', 'PUT: %j', req.body, {});

  return findOneDevice(req.params.deviceId)
    .then(function (device) {
      device = _.extend(device, req.body);

      return saveDevicePromise(device);
    })
    .then(
    function () {
      res.send(204);
    },
    function (err) {

      // @user message
      logger.error(err);

      res.jsonp(400, err);
    }
  )
    .done();
};
