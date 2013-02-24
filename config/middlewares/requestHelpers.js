var passwordHelpers = require('./passwordHelpers'),
	fs				= require('fs'),
	config			= require('../config')

exports.modifyRegister = function(req, files) {
  // Password
  passwordHelpers.saltAndHash(req.password, function(hash) {
  	req.password = hash
  })

  // Date of birth
  if (req.monthOfBirth.length == 1) {
    req.monthOfBirth = '0' + req.monthOfBirth
  }
  if (req.dayOfBirth.length == 1) {
    req.dayOfBirth = '0' + req.dayOfBirth
  }
  req.dateOfBirth = req.yearOfBirth + req.monthOfBirth + req.dayOfBirth

  // Desired duration
  req.desiredDuration = req.desiredDurationNumber + " " + req.desiredDurationScale

  // Profile photo
  if (files.photo) {
  	var tmp_path = files.photo.path
  	var extension = files.photo.type.replace(/(.*?)\//, '.')
  	var new_path = config.root + '/public/uploads/' + req.username + extension
  	req.photo = '/uploads/' + req.username + extension
  	fs.rename(tmp_path, new_path, function(err) {
  	  if (err) {
  		console.log(err) // handle error
  	  }
  	  fs.unlink(tmp_path)
  	})
  }

  return req
}

exports.modifyUpdate = function(req) {
  // Password
  passwordHelpers.saltAndHash(req.password, function(hash) {
    req.password = hash
  })

  // Date of birth
  if (req.monthOfBirth.length == 1) {
    req.monthOfBirth = '0' + req.monthOfBirth
  }
  if (req.dayOfBirth.length == 1) {
    req.dayOfBirth = '0' + req.dayOfBirth
  }
  req.dateOfBirth = req.yearOfBirth + req.monthOfBirth + req.dayOfBirth

  // Desired duration
  req.desiredDuration = req.desiredDurationNumber + " " + req.desiredDurationScale

  return req
}