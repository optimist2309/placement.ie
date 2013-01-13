$(function() {

  /*
   *  Header Login/Register Form
   *
   *  a) Show or hide password watermark input
   *  b) Hide the password watermark input on focus
   *  c) Hide or keep the password input on blur
   *  d) Handle username input based on value
   */
  if (!$('form#login input.password').val()) {
    $('form#login input.password').hide();
  } else {
    $('form#login input.passwordwatermark').hide();
  }

  $('form#login input.password-watermark').focus(function() {
    $(this).hide();
    $('form#login input.password').show().focus();
  });

  $('form#login input.password').blur(function() {
    if (!$(this).val()) {
      $(this).hide();
      $('form#login input.password-watermark').show();
    }
  });

  $('form#login input.username').focus(function() {
    if ($(this).val() === "Username") {
      $(this).val("");
    }
  }).blur(function() {
    if (!$(this).val()) {
      $(this).val("Username");
    }
  });

});