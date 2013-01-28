var passwordHelpers = require('./passwordHelpers');

exports.modifyRegister = function(req) {
  passwordHelpers.saltAndHash(req.password, function(hash) {
    req.password = hash;
  });
  req.dateOfBirth = req.yearOfBirth + req.monthOfBirth + req.dayOfBirth;
  return req;
};