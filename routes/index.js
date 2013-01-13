/*
 * GET home page.
 */

// Module dependencies.
var easydates = require('easydates');

module.exports = function(app) {

  // Home Page
  app.get('/', function(req, res) {
    res.render('index', {
      subtitle: 'Making Internships Easier',
      currentYear: easydates.getCurrentYear()
    });
  });

};