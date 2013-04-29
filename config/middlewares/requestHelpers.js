var passwordHelpers = require('./passwordHelpers'),
	fs				= require('fs'),
	config			= require('../config');

/**
 * Modify the POST params sent from the register form.
 *
 * @param req
 * @param files
 * @returns {*}
 */
exports.modifyRegister = function(req, files) {
    // Password
    passwordHelpers.saltAndHash(req.password, function(hash) {
        req.password = hash;
    })

    // Only if user
    if (!req.industry) {
        // Date of birth
        if (req.monthOfBirth.length == 1) {
            req.monthOfBirth = '0' + req.monthOfBirth;
        }
        if (req.dayOfBirth.length == 1) {
            req.dayOfBirth = '0' + req.dayOfBirth;
        }

        req.dateOfBirth = req.yearOfBirth + req.monthOfBirth + req.dayOfBirth;

        // Desired duration
        req.desiredDuration = req.desiredDurationNumber + " " + req.desiredDurationScale;
    }

    // Profile photo
    if (files.photo) {
        var tmp_path = files.photo.path;
        var extension = files.photo.type.replace(/(.*?)\//, '.');
        var new_path = config.root + '/public/uploads/' + req.username + extension;

        req.photo = '/uploads/' + req.username + extension;

        fs.rename(tmp_path, new_path, function(err) {
          if (err) {
            console.log(err);
          }
          fs.unlink(tmp_path);
        });
    }

    // Only if user
    if (!req.industry) {
        // Work experience
        for (var i = 0; i < req.job.length; i++) {
            if (!req.job[i].employer) {
                delete req.job[i];
            }
        }
    }

    return req;
};

/**
 * Modify the PUT params sent from the update form.
 *
 * @param req
 * @returns {*}
 */
exports.modifyUpdate = function(req) {
    // Password
    passwordHelpers.saltAndHash(req.password, function(hash) {
        req.password = hash;
    });

    // Date of birth
    if (req.monthOfBirth.length == 1) {
        req.monthOfBirth = '0' + req.monthOfBirth;
    }
    if (req.dayOfBirth.length == 1) {
        req.dayOfBirth = '0' + req.dayOfBirth;
    }

    req.dateOfBirth = req.yearOfBirth + req.monthOfBirth + req.dayOfBirth;

    // Desired duration
    req.desiredDuration = req.desiredDurationNumber + " " + req.desiredDurationScale;

    // Work experience
    for (var i = 0; i < req.job.length; i++) {
        if (!req.job[i].employer) {
            delete req.job[i];
        }
    }

    return req;
};

/**
 * Modify the params sent from the create job form.
 *
 * @param req
 * @returns {*}
 */
exports.modifyJob = function(req) {
    // Dates
    if (req.startDateMonth.length == 1) {
        req.startDateMonth = '0' + req.startDateMonth;
    }
    if (req.endDateMonth.length == 1) {
        req.endDateMonth = '0' + req.endDateMonth;
    }

    req.jobFrom = req.startDateYear + req.startDateMonth;
    req.jobTo = req.endDateYear + req.endDateMonth;

    return req;
};