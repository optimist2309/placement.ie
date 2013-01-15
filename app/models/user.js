/*
 * User schema
 */

// Dependencies
var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

var UserSchema = new Schema({
  forename: String,
  surname: String,
  email: String,
  username: String,
  password: String,
  dateOfBirth: String,
  title: String,
  description: String,
  field: String,
  specifics: String
});

mongoose.model('User', UserSchema);