/*
 * Helper constants and methods for views.
 */
module.exports = function(config) {
  return function(req, res, next) {
    res.locals.title = config.app.name
    res.locals.homeUrl = config.app.url
    res.locals.currentYear = 2013
    next()
  }
}