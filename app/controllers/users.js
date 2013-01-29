var mongoose        = require('mongoose'),
    User            = require('../models/user'),
    requestHelpers  = require('../../config/middlewares/requestHelpers');

exports.logIn = function(req, res) {

};

exports.register = function(req, res) {
  var colleges = [
    "Athlone Institute of Technology",
    "IT Tallaght",
    "Bray Institute",
    "Dublin City University",
    "Dublin Institute of Technolgy",
    "University College Dublin",
    "Trinity College Dublin",
    "NUI Galway",
    "NUI Maynooth",
    "University College Cork",
    "IT Sligo",
    "Cavan Institute",
    "Royal College of Surgeons",
    "Galway-Mayo Institute of Technology",
    "Waterford Institute of Technology",
    "National College of Ireland",
    "Not Applicable"].sort();

  res.render('register', {
    subtitle: "User Registration",
    colleges: colleges
  });
};

exports.logOut = function(req, res) {

};

exports.session = function(req, res) {

};

exports.create = function(req, res, next) {
  User.findOne({username: req.params.username}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (user) {
      return res.send('Conflict', 409);
    }
    req.body = requestHelpers.modifyRegister(req.body);
    User.create(req.body, function(err) {
      if (err) {
        return next(err);
      }
      res.set('previous-operation', 'register-success');
      res.redirect('/', 302);
    });
  });
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