/*
 * User routing table.
 */

// Module dependencies.
var easydates = require('easydates');

module.exports = function(app) {

  // GET - Register page.
  app.get('/users/new', function(req, res) {
    res.render('register', {
      subtitle: "User Registration",
      currentYear: easydates.getCurrentYear()
    });
  });

  // POST - Register user.
  app.post('/users/new', function(req, res) {
    res.end('Implement functionality to register a user.');
  });

  // PUT - Update user.
  app.put('/users/:username', function(req, res) {
    res.end('Implement functionality to update a user.');
  });

  // DELETE - Update user.
  app.del('/users/:username', function(req, res) {
    res.end('Implement functionality to delete a user.');
  });

  // GET - User profile.
  app.get('/users/:username', function(req, res) {
    res.render('user', {
      subtitle: req.params.username + "'s Profile",
      currentYear: easydates.getCurrentYear(),
      username: req.params.username
    });
  });

};