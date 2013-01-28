var User = require('../../app/models/user');

function loadUser(req, res, next) {
  User.findOne({username: req.params.username}, function(err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.send('Not found', 404);
    }
    req.user = user;
    next();
  });
}

module.exports = loadUser;