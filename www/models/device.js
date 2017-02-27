'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DeviceSchema = new Schema({
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  client_sw_no: {
    type: String,
    trim: true,
    required: true
  },
  client_dev_no: {
    type: String,
    trim: true,
    required: true
  },
  client_public_key: {
    type: String,
    trim: true,
    required: true
  },
  client_certificate: {
    type: String,
    trim: true,
    required: true
  }
});

/**
 * Validations
 */

var blankValidator = function (val) {
  if (val && val.length >= 1) {
    return true;
  }
  return false;
};

var lengthValidator = function (val) {
  if (val && val.length >= 3) {
    return true;
  }
  return false;
};

DeviceSchema.path('client_sw_no').validate(blankValidator, 'cannot be blank');
DeviceSchema.path('client_dev_no').validate(blankValidator, 'cannot be blank');
DeviceSchema.path('client_public_key').validate(blankValidator, 'cannot be blank');
DeviceSchema.path('client_certificate').validate(blankValidator, 'cannot be blank');
//DeviceSchema.path('title').validate(lengthValidator, 'must be at least 3 characters');


/**
 * Statics
 */

DeviceSchema.statics.load = function (id, cb) {
  this.findOne({
    _id: id
  }).populate('user', 'name username').exec(cb);

};

mongoose.model('Device', DeviceSchema);
