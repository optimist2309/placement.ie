$(function() {

  /*
   * Register Page
   */
  function requiredEmpty() {
    var oneIsEmpty = false;
    $('.required').each(function() {
      if (!$(this).val()) {
        $(this).addClass('input-empty');
        oneIsEmpty = true;
      } else {
        $(this).removeClass('input-empty');
      }
    });
    if (oneIsEmpty == true) {
      $('#register-submit').attr('disabled', 'disabled').addClass('submit-disabled');
    } else {
      $('#register-submit').removeAttr('disabled').removeClass('submit-disabled');
    }
  }
  requiredEmpty();
  $('#register input, #register textarea, #register select').focus(requiredEmpty).blur(requiredEmpty);

  function passwordMatch() {
    if ($('#register-password').val() != $('#register-confirm-password').val()) {
      $('#register-password-hint').stop(true, true).fadeIn(500);
    } else {
      $('#register-password-hint').stop(true, true).fadeOut(500);
    }
  }
  passwordMatch();
  $('#register-password, #register-confirm-password').focus(passwordMatch).blur(passwordMatch);

});