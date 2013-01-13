/*
 *  This is the main file called when the application is started.
 */

// Module dependencies.
var express = require('express'),
  routes    = require('./routes'),
  http      = require('http'),
  path      = require('path'),
  stylus    = require('stylus');

var app = express();

// Configure the application.
app.configure(function() {

  // Set port, views directory and view engine.
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  // Favicon and logger.
  app.use(express.favicon());
  app.use(express.logger('dev'));

  // Use stylus as CSS template language.
  app.use(stylus.middleware({
    src: __dirname + '/views',
    dest: __dirname + '/public'
  }));

  // Constants available to every part of the app.
  app.locals({
    constants: {
      title: 'placement.ie',
      homeUrl: 'http://localhost:3000'
    }
  });

  // Parse request body and allow use of PUT and DELETE.
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  // Router to dispatch request to appropriate listener defined in routing table.
  app.use(app.router);

  // File server to serve static files (the public directory).
  app.use(express.static(path.join(__dirname, 'public')));
});

// For development purposes, error handling is fully enabled.
app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routing requests.
require('./routes/index')(app);
require('./routes/users')(app);

// Create the server.
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port') + ".\nSite should be online at http://localhost:" + app.get('port'));
});
