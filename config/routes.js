module.exports = function(app) {

  // Home route
  app.get('/', function(req, res) {
    res.render('index', {
      subtitle: 'Making Internships Easier'
    });
  });

  // User routes
  var users = require('../app/controllers/users');
  app.get('/users/login', users.logIn);
  app.get('/users/new', users.register);
  app.get('/users/logout', users.logOut);
  app.get('/users/:username', users.show)
  app.post('/users/new', users.create);
  app.post('/users/:username/session', users.session);
  app.put('/users/:username', users.update);
  app.del('/users/:username', users.remove);

};