/*
 * User schema
 */

// Dependencies
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var UserSchema = new Schema({
  username: {type: String, unique: true},
  email: String,
  password: String,
  forename: String,
  surname: String,
  dateOfBirth: String,
  addressLine1: String,
  addressLine2: String,
  townCity: String,
  county: String,
  phone: String,
  college: String,
  collegeCourse: String,
  collegeFrom: Number,
  collegeTo: Number,
  school: String,
  leavingCert: Boolean,
  schoolFrom: Number,
  schoolTo: Number,
  job: [{
    employer: String,
    jobTitle: String,
    jobDesc: String,
    jobFrom: Number,
    jobTo: Number
  }],
  roleSeeking: String,
  desiredDuration: Number
});

var User = mongoose.model('User', UserSchema);

module.exports = User;