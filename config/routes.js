var users = require('../app/controllers/users'),
    home  = require('../app/controllers/home')

module.exports = function(app) {

  // Home routes
  app.get('/', home.show)
  app.get('/?register=success', home.show)

  // User routes
  app.get('/users/login', users.logIn)
  app.get('/users/new', users.register)
  app.get('/users/logout', users.logOut)
  app.get('/users/:username', users.show)
  app.post('/users/new', users.create)
  app.post('/users/:username/session', users.session)
  app.put('/users/:username', users.update)
  app.del('/users/:username', users.remove)

}