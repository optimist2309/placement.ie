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

  var user = null
  if (req.session.user) {
    user = req.session.user
  }

  sidebarData.getDefaultSidebar(function(err, jobseekers) {
    res.render('register', {
      subtitle: 'User Registration',
      colleges: colleges,
      jobseekers: jobseekers,
      user: user
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

exports.edit = function(req, res) {
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

  if (req.session.user) {
    var user = req.session.user

    // Append some necessary attributes
    user.dayOfBirth = user.dateOfBirth.substr(6, 2)
    user.monthOfBirth = user.dateOfBirth.substr(4, 2)
    user.yearOfBirth = user.dateOfBirth.substr(0, 4)
    user.desiredDurationNumber = user.desiredDuration.split(" ")[0]
    user.desiredDurationScale = user.desiredDuration.split(" ")[1]

    sidebarData.getDefaultSidebar(function(err, jobseekers) {
      res.render('edituser', {
        subtitle: 'Edit ' + user.forename + '\'s Profile',
        jobseekers: jobseekers,
        colleges: colleges,
        user: user
      })
    })
  } else {
    res.send('Not Found', 404)
  }
}

exports.update = function(req, res, next) {
  req.body = requestHelpers.modifyUpdate(req.body)
  User.findOneAndUpdate({username: req.params.username}, {$set: req.body}, function(err, user) {
    if (err) {
      res.send('Conflict', 409)
    }
    if (user) {
      req.session.user = user
      res.redirect('/?update=success', 302)
    }
  })
}

exports.remove = function(req, res) {
  var user = null
  if (req.session.user) {
    user = req.session.user
  }

  if (user) {
    sidebarData.getDefaultSidebar(function(err, jobseekers) {
      res.render('removeuser', {
        subtitle: 'Sorry to see you go, ' + user.forename,
        jobseekers: jobseekers,
        user: user
      })
    })
  }
}

exports.delete = function(req, res) {
  var user = null
  if (req.session.user) {
    user = req.session.user
  }

  if (user.username == req.params.username) {
    User.findOneAndRemove({username: req.params.username}, function(err, result) {
      if (err) {
        res.send('User not found', 400)
      }
      if (result) {
        res.clearCookie('username')
        res.clearCookie('password')
        req.session.destroy(function(err) {
          res.redirect('/?remove=success')
        })
      }
    })
  }
}

exports.show = function(req, res) {
  User.findOne({username: req.params.username}, function(err, profile) {
    profile.dateOfBirth = easydates.dateFromDateStamp(profile.dateOfBirth)

    var user = null
    if (req.session.user) {
      user = req.session.user
    }

    sidebarData.getDefaultSidebar(function(err, jobseekers) {
      res.render('user', {
        subtitle: profile.forename + '\'s Profile',
        profile: profile,
        jobseekers: jobseekers,
        user: user
      })
    })

  })
}