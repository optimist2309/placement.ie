var mongoose        = require('mongoose'),
    Employer        = require('../models/employer'),
    requestHelpers  = require('../../config/middlewares/requestHelpers'),
    sidebarData     = require('../../config/middlewares/sidebarData'),
    passwordHelpers = require('../../config/middlewares/passwordHelpers');

/**
 * Show the login/register page.
 *
 * @param req
 * @param res
 */
exports.showLoginRegister = function(req, res) {
    var user = null;
    var employer = null;

    if (req.session.user) {
        res.send('Conflict', 409);
    } else if (req.session.employer) {
        res.redirect('/employers/' + req.session.employer.username, 302);
    } else {
        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('employers', {
                subtitle: 'Employers',
                jobseekers: jobseekers,
                companies: companies,
                user: user,
                employer: employer
            });
        });
    }
};

/**
 * Log the employer in.
 *
 * @param req
 * @param res
 */
exports.logIn = function(req, res) {
    Employer.findOne({username: req.query.username}, function(err, employer) {
        if (!employer) {
            res.send(err, 400);
        } else {
            passwordHelpers.validatePassword(req.query.password, employer.password, function(err, result) {
                if (result) {
                    req.session.employer = employer;
                    res.cookie('username', employer.username, {maxAge: 1200000});
                    res.cookie('password', employer.password, {maxAge: 1200000});
                    res.redirect('/employers/' + employer.username);
                } else {
                    res.send(err, 400);
                }
            })
        }
    });
};

/**
 * Log the employer out.
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
 * Create a new employer.
 *
 * @param req
 * @param res
 */
exports.create = function(req, res) {
    Employer.findOne({username: req.params.username}, function(err, employer) {
        if (err || employer) {
            res.send('Conflict', 409);
        }
        req.body = requestHelpers.modifyRegister(req.body, req.files);

        Employer.create(req.body, function(err) {
            if (err) {
                res.redirect('/?register=failed', 409);
            }
            res.redirect('/?register=success', 302);
        });
    });
};

/**
 * Show an employer.
 *
 * @param req
 * @param res
 */
exports.show = function(req, res) {
    Employer.findOne({username: req.params.username}, function(err, profile) {
        var user = null;
        var employer = null;

        if (req.session.user) {
            user = req.session.user;
        } else if (req.session.employer) {
            employer = req.session.employer;
        }

        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('employer', {
                subtitle: profile.name,
                profile: profile,
                jobseekers: jobseekers,
                companies: companies,
                user: user,
                employer: employer
            });
        });
    });
};

/**
 * Show the page prompting the employer to confirm they want to leave.
 *
 * @param req
 * @param res
 */
exports.remove = function(req, res) {
    var employer = null;

    if (req.session.employer) {
        employer = req.session.employer;
    } else if (req.session.user) {
        res.redirect('/users/' + req.session.user.username, 302);
    }

    if (employer) {
        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('removeemployer', {
                subtitle: 'Sorry to see you go, ' + employer.name,
                jobseekers: jobseekers,
                companies: companies,
                user: null,
                employer: employer
            });
        });
    }
};

/**
 * Delete an employer.
 *
 * @param req
 * @param res
 */
exports.delete = function(req, res) {
    var employer = null;

    if (req.session.employer) {
        employer = req.session.employer;
    }

    if (employer.username == req.params.username) {
        Employer.findOneAndRemove({username: req.params.username}, function(err, result) {
            if (err) {
                res.send('Employer not found', 400);
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
 * List all jobs.
 *
 * @param req
 * @param res
 */
exports.listJobs = function(req, res) {
    var user = null;
    var employer = null;
    var jobEmployers = [];

    if (req.session.employer) {
        employer = req.session.employer;
    } else if (req.session.user) {
        user = req.session.user;
    }

    Employer.find().sort('-latestJob').exec(function(err, employers) {
        var i;
        for (i = 0; i < employers.length; i++) {
            if (employers[i].jobs.length !== 0) {
                jobEmployers.push(employers[i]);
            }
        }

        sidebarData.getHomeData(function(err, jobseekers, companies) {
            res.render('jobs', {
                subtitle: 'Available Jobs',
                jobseekers: jobseekers,
                companies: companies,
                user: user,
                employer: employer,
                jobEmployers: jobEmployers
            });
        });
    });
};

/**
 * Show the "add job" form.
 *
 * @param req
 * @param res
 */
exports.showAddJob = function(req, res) {
    var employer = null;

    if (req.session.employer) {
        employer = req.session.employer;
    }

    if (employer) {
        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('addjob', {
                subtitle: 'Add a new position',
                jobseekers: jobseekers,
                companies: companies,
                user: null,
                employer: employer
            });
        });
    }
};

/**
 * Add a job.
 *
 * @param req
 * @param res
 */
exports.addJob = function(req, res) {
    var employer = null;

    if (req.session.employer) {
        employer = req.session.employer;
    }
    req.body = requestHelpers.modifyJob(req.body);

    if (employer.username == req.params.username) {
        Employer.findOneAndUpdate(
                {username: req.params.username},
                {$push: {jobs: req.body}, $set: {latestJob: Date.now()}},
                function(err) {
            if (err) {
                res.send(err, 400);
            }

            sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
                res.render('employer', {
                    subtitle: employer.name,
                    profile: employer,
                    jobseekers: jobseekers,
                    companies: companies,
                    user: null,
                    employer: employer
                });
            });
        });
    }
};

/**
 * Show a single job posting.
 *
 * @param req
 * @param res
 */
exports.showJob = function(req, res) {
    Employer.findOne({username: req.params.username}, function(err, company) {
        var user = null;
        var employer = null;

        if (req.session.user) {
            user = req.session.user;
        } else if (req.session.employer) {
            employer = req.session.employer;
        }

        // Need to handle when index not available

        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
            res.render('job', {
                subtitle: company.jobs[req.params.id - 1].jobTitle,
                job: company.jobs[req.params.id - 1],
                jobIndex: req.params.id - 1,
                profile: company,
                jobseekers: jobseekers,
                companies: companies,
                user: user,
                employer: employer
            });
        });
    });
};

/**
 * Delete a job posting.
 *
 * @param req
 * @param res
 */
exports.deleteJob = function(req, res) {
    var employer = null;

    if (req.session.employer) {
        employer = req.session.employer;
    }

    if (employer.username == req.params.username) {
        Employer.findOne({username: req.params.username}, function(err, profile) {
            if (err) {
                res.send(err, 400);
            }

            var idx = profile.jobs ? profile.jobs.indexOf(req.params.id - 1) : -1;
            if (idx === -1) {
                profile.jobs.splice(idx, 1);
                profile.save(function(err) {
                    if (err) {
                        res.send(err, 400);
                    } else {
                        sidebarData.getDefaultSidebar(function(err, jobseekers, companies) {
                            res.render('employer', {
                                subtitle: profile.name,
                                profile: profile,
                                jobseekers: jobseekers,
                                companies: companies,
                                user: null,
                                employer: employer
                            });
                        });
                    }
                });
            }
        });
    }
};

/**
 * Apply for job.
 *
 * @param req
 * @param res
 */
exports.applyForJob = function(req, res) {
    var user = null;
    var jobId = req.body.jobId;

    if (req.session.user) {
        user = req.session.user;

        Employer.findOne({username: req.body.employer}, function(err, employer) {
            var job = employer.jobs[jobId];
            job.applicants.push(user.username);

            employer.jobs.set(jobId, job);
            employer.save();

            res.redirect('/?apply=success');
        });
    }
};