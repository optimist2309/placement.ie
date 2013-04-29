var sidebarData = require('../../config/middlewares/sidebarData')
    Employer    = require('../models/employer');

/**
 * Show the home page.
 *
 * @param req
 * @param res
 */
exports.show = function(req, res) {
    var message = '';
    var messageType = 0;

    if (req.query.register == "success") {
        message = "Congratulations! You have successfully registered.";
        messageType = 1;
    } else if (req.query.register == "failed") {
        message = "We're sorry, there was a problem with your registration.";
        messageType = 2;
    } else if (req.query.update == "success") {
        message = "Congratulations! You have successfully updated your profile.";
        messageType = 1;
    } else if (req.query.update == "failed") {
        message = "We're sorry, there was a problem updating your profile.";
        messageType = 2;
    } else if (req.query.remove == "success") {
        message = "You have successfully deleted your profile";
        messageType = 1;
    } else if (req.query.remove == "failed") {
        message = "We're sorry, there was a problem removing that profile";
        messageType = 2;
    }

    var user = null;
    var employer = null;

    if (req.session.user) {
        user = req.session.user;
    } else if (req.session.employer) {
        employer = req.session.employer;
    }

    sidebarData.getHomeData(function(err, jobseekers, companies, jobEmployers) {
        res.render('index', {
            subtitle: 'Making Internships Easier',
            jobseekers: jobseekers,
            companies: companies,
            message: message,
            messageType: messageType,
            user: user,
            employer: employer,
            jobEmployers: jobEmployers
        });
    });
};