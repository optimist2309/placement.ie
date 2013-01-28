var crypto = require('crypto');

function generateSalt() {
  var set = '0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var salt = '';
  for (var i = 0; i < 10; i++) {
    var pos = Math.floor(Math.random() * set.length);
    salt += set[pos];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

exports.saltAndHash = function(password, callback) {
  var salt = generateSalt();
  callback(salt + md5(password + salt));
};