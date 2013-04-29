var users     = require('../app/controllers/users'),
    home      = require('../app/controllers/home'),
    employers = require('../app/controllers/employers');

module.exports = function(app) {
    // Home routes
    app.get('/', home.show)
    app.get('/?register=success', home.show);

    // User routes
    app.get('/users/login', users.logIn);
    app.get('/users/new', users.register);
    app.get('/users/logout', users.logOut);
    app.get('/users/:username', users.show);
    app.get('/users/:username/edit', users.edit);
    app.get('/users/:username/remove', users.remove);
    app.post('/users/new', users.create);
    app.put('/users/:username', users.update);
    app.del('/users/:username', users.delete);

    // Employer routes
    app.get('/employers', employers.showLoginRegister);
    app.get('/employers/login', employers.logIn);
    app.get('/employers/logout', employers.logOut);
    app.get('/employers/:username', employers.show);
    app.get('/employers/:username/remove', employers.remove);
    app.post('/employers/new', employers.create);
    app.del('/employers/:username', employers.delete);
    app.get('/employers/:username/jobs', employers.listJobs);
    app.get('/employers/:username/jobs/new', employers.showAddJob);
    app.post('/employers/:username/jobs', employers.addJob);
    app.get('/employers/:username/jobs/:id', employers.showJob);
    app.put('/employers/:username/jobs/:id', employers.editJob);
    app.del('/employers/:username/jobs/:id', employers.deleteJob);
    app.get('/employers/:username/jobs/:id/edit', employers.showEditJob);
};