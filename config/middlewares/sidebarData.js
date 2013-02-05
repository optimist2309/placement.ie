var User = require('../../app/models/user')

exports.getDefaultSidebar = function(callback) {
  getUsers(function(err, users) {
    callback(err, users)
  })
}

function getUsers(callback) {
  User.find().sort('-joinDate').limit(2).exec(callback)
}