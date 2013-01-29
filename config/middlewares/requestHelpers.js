var passwordHelpers = require('./passwordHelpers');

exports.modifyRegister = function(req) {
  passwordHelpers.saltAndHash(req.password, function(hash) {
    req.password = hash;
  });

  if (req.monthOfBirth.length == 1) {
    req.monthOfBirth = '0' + req.monthOfBirth;
  }
  if (req.dayOfBirth.length == 1) {
    req.dayOfBirth = '0' + req.dayOfBirth;
  }
  req.dateOfBirth = req.yearOfBirth + req.monthOfBirth + req.dayOfBirth;

  return req;
};