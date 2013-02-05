/*
 *  This is the main file called when the application is started.
 */

// Dependencies.
var express     = require('express'),
    http        = require('http'),
    path        = require('path'),
    fs          = require('fs'),
    stylus      = require('stylus'),
    config      = require('./config/config'),
    viewHelpers = require('./config/middlewares/viewHelpers'),
    mongoose    = require('mongoose'),
    MongoStore  = require('connect-mongo')(express)

// Initialize database.
mongoose.connect(config.db)

// Bootstrap all models.
var modelsPath = __dirname + '/app/models'
fs.readdirSync(modelsPath).forEach(function(file) {
  require(modelsPath + '/' + file)
})

// Assign app to initialized express.
var app = express()

// Configure the application.
app.configure(function() {

  // Set port, views directory and view engine.
  app.set('port', process.env.PORT || 3000)
  app.set('views', __dirname + '/app/views')
  app.set('view engine', 'jade')

  // Favicon and logger.
  app.use(express.favicon())
  app.use(express.logger('dev'))

  // Use stylus as CSS template language.
  app.use(stylus.middleware({
    src: __dirname + '/app/views',
    dest: __dirname + '/public'
  }))

  // View helpers.
  app.use(viewHelpers(config))

  // Parse request body and allow use of PUT and DELETE.
  app.use(express.bodyParser({uploadDir: './uploads'}))
  app.use(express.methodOverride())

  // Parse cookies.
  app.use(express.cookieParser())

  // Store sessions in MongoDB.
  app.use(express.session({
    secret: 'XKF20AA31PP0',
    store: new MongoStore({
      url: config.db,
      collection: 'sessions'
    })
  }))

  // Router to dispatch request to appropriate listener defined in routing table.
  app.use(app.router)

  // File server to serve static files (the public directory).
  app.use(express.static(path.join(__dirname, 'public')))
})

// For development purposes, error handling is fully enabled.
app.configure('development', function(){
  app.use(express.errorHandler())
})

// Routing requests.
require('./config/routes')(app)

// Create the server.
http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port') + ".\nSite should be online at http://localhost:" + app.get('port'))
})
