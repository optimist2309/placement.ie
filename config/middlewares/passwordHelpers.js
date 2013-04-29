var crypto = require('crypto');

/**
 * Generate a salt for a password.
 *
 * @returns {string}
 */
function generateSalt() {
    var set = '0123456789abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var salt = '';

    for (var i = 0; i < 10; i++) {
        var pos = Math.floor(Math.random() * set.length);
        salt += set[pos];
    }

    return salt
}

/**
 * Encrypt a string using the MD5 algorithm.
 *
 * @param string
 * @returns {*}
 */
function md5(string) {
    return crypto.createHash('md5').update(string).digest('hex');
}

/**
 * Salt and hash a password, returning the result as
 * a parameter in the callback.
 *
 * @param password
 * @param callback
 */
exports.saltAndHash = function(password, callback) {
    var salt = generateSalt();
    callback(salt + md5(password + salt));
};

/**
 * Validate a password against it's encrypted equivalent.
 *
 * @param plain
 * @param hashed
 * @param callback
 */
exports.validatePassword = function(plain, hashed, callback) {
    var salt = hashed.substr(0, 10);
    var valid = salt + md5(plain + salt);
    callback(null, hashed === valid);
};