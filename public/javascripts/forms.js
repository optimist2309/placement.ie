$(function() {

  /*
   * Register Page
   */
  if (!$('#register .required').val()) {
    $(this).addClass('input-empty');
    $('#register-submit').attr('disabled', 'disabled');
  } else {
    $(this).removeClass('input-empty');
    $('#register-submit').removeAttr('disabled');
  }

  $('#register input, #register select, #register textarea').focus(function() {
    if (!$('#register .required').val()) {
      $(this).addClass('input-empty');
      $('#register-submit').attr('disabled', 'disabled');
    } else {
      $(this).removeClass('input-empty');
      $('#register-submit').removeAttr('disabled');
    }
  }).blur(function() {
    if (!$('#register .required').val()) {
      $(this).addClass('input-empty');
      $('#register-submit').attr('disabled', 'disabled');
    } else {
      $(this).removeClass('input-empty');
      $('#register-submit').removeAttr('disabled');
    }
  });

});