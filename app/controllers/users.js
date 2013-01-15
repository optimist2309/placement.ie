var mongoose  = require('mongoose'),
    User      = mongoose.model('User');

exports.logIn = function(req, res) {

};

exports.register = function(req, res) {
  res.render('register', {
    subtitle: "User Registration"
  });
};

exports.logOut = function(req, res) {

};

exports.session = function(req, res) {

};

exports.create = function(req, res) {
  res.end('Implement functionality to register a user.');
};

exports.update = function(req, res) {
  res.end('Implement functionality to update a user.');
};

exports.remove = function(req, res) {
  res.end('Implement functionality to delete a user.');
};

exports.show = function(req, res) {
  res.render('user', {
    subtitle: req.params.username + "'s Profile",
    username: req.params.username
  });
};