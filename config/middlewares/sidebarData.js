var User      = require('../../app/models/user'),
    Employer  = require('../../app/models/employer');

/**
 * Return the default sidebar information.
 *
 * @param callback
 */
exports.getDefaultSidebar = function(callback) {
    getUsers(function(err, users) {
        getCompanies(function(err, companies) {
            callback(err, users, companies);
        });
    });
};

/**
 * Return the default home data.
 *
 * @param callback
 */
exports.getHomeData = function(callback) {
    getUsers(function(err, users) {
        getCompanies(function(err, companies) {
            getJobs(function(err, employers) {
                callback(err, users, companies, employers);
            });
        });
    });
};

/**
 * Return the specified number of users.
 *
 * @param callback
 */
function getUsers(callback) {
    User.find().sort('-joinDate').limit(2).exec(callback);
}

/**
 * Return the specified number of companies.
 *
 * @param callback
 */
function getCompanies(callback) {
    Employer.find().sort('-joinDate').limit(2).exec(callback);
}

/**
 * Return the specified number of jobs.
 *
 * @param callback
 */
function getJobs(callback) {
    Employer.find().sort('-latestJob').limit(4).exec(callback);
}