var mongoose        = require('mongoose'),
    User            = require('../models/user'),
    requestHelpers  = require('../../config/middlewares/requestHelpers'),
    sidebarData     = require('../../config/middlewares/sidebarData'),
    easydates       = require('easydates'),
    passwordHelpers = require('../../config/middlewares/passwordHelpers');

/**
 * Log a user in.
 *
 * @param req
 * @param res
 */
exports.logIn = function(req, res) {
    User.findOne({username: req.query.username}, function(err, user) {
        if (!user) {
            res.send(err, 400);
        } else {
            passwordHelpers.validatePassword(req.query.password, user.password, function(err, result) {
                if (result) {
                    req.session.user = user;
                    res.cookie('username', user.username, {maxAge: 1200000});
                    res.cookie('password', user.password, {maxAge: 1200000});
                    res.redirect('/users/' + user.username);
                } else {
                    res.send(err, 400);
                }
            });
        }
    });
};

/**
 * Show the register page.
 *
 * @param req
 * @param res
 */
exports.register = function(req, res) {
    var user = null;
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
    ].sort();

    if (req.session.user) {
        user = req.session.user;
    } else if (req.session.employer) {
        res.redirect('/employers/' + req.session.employer.username, 302);
    }

    sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
        res.render('register', {
            subtitle: 'User Registration',
            colleges: colleges,
            jobseekers: jobseekers,
            companies: companies,
            user: user,
            employer: null
        });
    });
};

/**
 * Log a user out.
 *
 * @param req
 * @param res
 */
exports.logOut = function(req, res) {
    res.clearCookie('username');
    res.clearCookie('password');

    req.session.destroy(function(err) {
        if (!err) {
            res.redirect('/');
        }
    });
};

/**
 * Create a new user.
 *
 * @param req
 * @param res
 */
exports.create = function(req, res) {
    User.findOne({username: req.params.username}, function(err, user) {
        if (err || user) {
            res.send('Conflict', 409);
        }
        req.body = requestHelpers.modifyRegister(req.body, req.files);

        User.create(req.body, function(err) {
            if (err) {
                res.redirect('/?register=failed', 409);
            }
            res.redirect('/?register=success', 302);
        });
    });
};

/**
 * Show the edit form for a user.
 *
 * @param req
 * @param res
 */
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
    ].sort();

    if (req.session.employer) {
        res.redirect('/employers/' + req.session.employer.username, 302);
    }

    if (req.session.user) {
        var user = req.session.user;

        // Append some necessary attributes
        user.dayOfBirth = user.dateOfBirth.substr(6, 2);
        user.monthOfBirth = user.dateOfBirth.substr(4, 2);
        user.yearOfBirth = user.dateOfBirth.substr(0, 4);
        user.desiredDurationNumber = user.desiredDuration.split(" ")[0];
        user.desiredDurationScale = user.desiredDuration.split(" ")[1];

        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('edituser', {
                subtitle: 'Edit ' + user.forename + '\'s Profile',
                jobseekers: jobseekers,
                companies: companies,
                colleges: colleges,
                user: user,
                employer: null
            });
        });
    } else {
        res.send('Not Found', 404);
    }
};

/**
 * Update a user.
 *
 * @param req
 * @param res
 * @param next
 */
exports.update = function(req, res, next) {
    req.body = requestHelpers.modifyUpdate(req.body);

    User.findOneAndUpdate({username: req.params.username}, {$set: req.body}, function(err, user) {
        if (err) {
          res.send('Conflict', 409);
        }
        if (user) {
            req.session.user = user;
            res.redirect('/?update=success', 302);
        }
    });
};

/**
 * Prompt the user to accept deleting their profile.
 *
 * @param req
 * @param res
 */
exports.remove = function(req, res) {
    var user = null;

    if (req.session.user) {
        user = req.session.user;
    } else if (req.session.employer) {
        res.redirect('/employers/' + req.session.employer.username, 302);
    }

    if (user) {
        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('removeuser', {
                subtitle: 'Sorry to see you go, ' + user.forename,
                jobseekers: jobseekers,
                companies: companies,
                user: user,
                employer: null
            });
        });
    }
};

/**
 * Delete a user.
 *
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    var user = null;

    if (req.session.user) {
        user = req.session.user;
    }

    if (user.username == req.params.username) {
        User.findOneAndRemove({username: req.params.username}, function(err, result) {
            if (err) {
                res.send('User not found', 400);
            }
            if (result) {
                res.clearCookie('username');
                res.clearCookie('password');
                req.session.destroy(function(err) {
                    res.redirect('/?remove=success');
                });
            }
        });
    }
};

/**
 * Show a single user.
 *
 * @param req
 * @param res
 */
exports.show = function(req, res) {
    User.findOne({username: req.params.username}, function(err, profile) {
        var user = null;
        var employer = null;

        profile.dateOfBirth = easydates.dateFromDateStamp(profile.dateOfBirth);

        if (req.session.user) {
            user = req.session.user;
        } else if (req.session.employer) {
            employer = req.session.employer;
        }

        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('user', {
                subtitle: profile.forename + '\'s Profile',
                profile: profile,
                jobseekers: jobseekers,
                companies: companies,
                user: user,
                employer: employer
            });
        });
    });
};