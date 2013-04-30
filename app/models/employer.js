var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

/**
 * Employers show details about the company and are
 * able to post job positions.
 *
 * @type {Schema}
 */
var EmployerSchema = new Schema({
    username: {type: String, unique: true},
    email: String,
    password: String,
    photo: String,
    name: String,
    industry: String,
    description: String,
    employees: Number,
    addressLine1: String,
    addressLine2: String,
    townCity: String,
    county: String,
    jobs: [{
        jobTitle: String,
        jobDesc: String,
        jobFrom: Number,
        jobTo: Number,
        applicants: []
    }],
    joinDate: {type: Date, default: Date.now},
    latestJob: String
});

var Employer = mongoose.model('Employer', EmployerSchema);

module.exports = Employer;