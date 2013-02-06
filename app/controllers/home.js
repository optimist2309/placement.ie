var sidebarData = require('../../config/middlewares/sidebarData')

exports.show = function(req, res) {
  var message = ''
  var messageType = 0
  if (req.query.register == "success") {
    message = "Congratulations! You have successfully registered."
    messageType = 1
  } else if (req.query.register == "failed") {
    message = "We're sorry, there was a problem with your registration."
    messageType = 2
  }

  var user = null
  if (req.session.user) {
    user = req.session.user
  }

  sidebarData.getDefaultSidebar(function(err, jobseekers) {
    res.render('index', {
      subtitle: 'Making Internships Easier',
      jobseekers: jobseekers,
      message: message,
      messageType: messageType,
      user: user
    })
  })
}