var mongoose        = require('mongoose'),
    User            = require('../models/user'),
    requestHelpers  = require('../../config/middlewares/requestHelpers'),
    sidebarData     = require('../../config/middlewares/sidebarData'),
    easydates       = require('easydates'),
    passwordHelpers = require('../../config/middlewares/passwordHelpers')

exports.logIn = function(req, res) {
  User.findOne({username: req.query.username}, function(err, user) {
    if (!user) {
      res.send(err, 400)
    } else {
      passwordHelpers.validatePassword(req.query.password, user.password, function(err, result) {
        if (result) {
          req.session.user = user
          res.cookie('username', user.username, {maxAge: 1200000})
          res.cookie('password', user.password, {maxAge: 1200000})
          res.redirect('/users/' + user.username)
        } else {
          res.send(err, 400)
        }
      })
    }
  })
}

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
    "Not Applicable"
  ].sort()

  sidebarData.getDefaultSidebar(function(err, jobseekers) {
    res.render('register', {
      subtitle: 'User Registration',
      colleges: colleges,
      jobseekers: jobseekers
    })
  })
}

exports.logOut = function(req, res) {
  res.clearCookie('username')
  res.clearCookie('password')
  req.session.destroy(function(err) {
    if (!err) {
      res.redirect('/')
    }
  })
}

exports.session = function(req, res) {

}

exports.create = function(req, res, next) {
  User.findOne({username: req.params.username}, function(err, user) {
    if (err) {
      next(err)
    }
    if (user) {
      res.send('Conflict', 409)
    }
    req.body = requestHelpers.modifyRegister(req.body, req.files)

    User.create(req.body, function(err) {
      if (err) {
        next(err)
      }
      res.redirect('/?register=success', 302)
    })
  })
}

exports.update = function(req, res) {
  res.end('Implement functionality to update a user.')
}

exports.remove = function(req, res) {
  res.end('Implement functionality to delete a user.')
}

exports.show = function(req, res) {
  User.findOne({username: req.params.username}, function(err, user) {
    user.dateOfBirth = easydates.dateFromDateStamp(user.dateOfBirth)

    sidebarData.getDefaultSidebar(function(err, jobseekers) {
      res.render('user', {
        subtitle: user.forename + '\'s Profile',
        user: user, // Error here, need to rename!!!
        jobseekers: jobseekers
      })
    })

  })
}