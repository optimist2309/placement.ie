$(function() {

  /*
   *  Register form
   */
  $('#register-day-of-birth, #register-month-of-birth, #register-year-of-birth').change(function() {
    $('#register-date-of-birth').val(
      $('#register-year-of-birth').val() +
      $('#register-month-of-birth').val() +
      $('#register-day-of-birth').val()
    );
  });

});