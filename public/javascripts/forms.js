$(function() {

    /**
     * Check if any required fields are empty.
     */
    function requiredEmpty() {
        var oneIsEmpty = false;

        $('.register-or-update .required').each(function() {
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
    $('#register input, #register textarea, #register select, #update-user input, ' +
        '#update-user textarea, #update-user select').focus(requiredEmpty).blur(requiredEmpty);

    // Add other work experience positions
    $('#register-add-another-job').click(function(e) {
        e.preventDefault();

        var $fields = $('.work-experience-fields-0').clone();
        var jobId = $('.work-experience-fields').length;

        $fields.removeClass('work-experience-fields-0').addClass('work-experience-fields-' + jobId);
        $fields.children().each(function(i) {
            if ($(this).attr('name')) {
                var nameAttr = $(this).attr('name');
                nameAttr = nameAttr.replace(/[0-9]+/g, jobId);
                $(this).attr('name', nameAttr);
            }
        });

        $fields.prepend('<hr class="experience-separator" />');
        $('#register-add-another-job').before($fields);
    });

    /**
     * Check if the passwords match.
     */
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