var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema;

/**
 * Users show details about their work and education
 * history and can apply for job positions.
 *
 * @type {Schema}
 */
var UserSchema = new Schema({
    username: {type: String, unique: true},
    email: String,
    password: String,
    photo: String,
    forename: String,
    surname: String,
    dateOfBirth: String,
    addressLine1: String,
    addressLine2: String,
    townCity: String,
    county: String,
    phone: String,
    college: String,
    collegeCourse: String,
    collegeFrom: Number,
    collegeTo: Number,
    school: String,
    leavingCert: Boolean,
    schoolFrom: Number,
    schoolTo: Number,
    job: [{
        employer: String,
        jobTitle: String,
        jobDesc: String,
        jobFrom: Number,
        jobTo: Number
    }],
    roleSeeking: String,
    desiredDuration: String,
    joinDate: {type: Date, default: Date.now}
})

var User = mongoose.model('User', UserSchema);

module.exports = User;