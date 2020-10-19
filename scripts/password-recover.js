$(() => {

  $("#recover-password-submit-button").on("click", (e) => {
    const emailHash = $('#email-hash').data('emailhash');
    const recoveryHash = $('#recovery-hash').data('recoveryhash');

    console.log(emailHash, recoveryHash);
    const passwordText1 = document.getElementById('change-password-box-one').value;
    const passwordText2 = document.getElementById('change-password-box-two').value;
    $('#recover-password-submit-button').attr('disabled', true);
    if (passwordText1 !== passwordText2) {
      $("#change-password-error-message").css('display', 'block').text('Ensure your passwords match');
      return;
    }

    if (passwordSecurityValid(passwordText1) === false) {
      $("#change-password-error-message")
        .css({ 'display': 'block', 'color': 'red' })
        .text('Password should be minimum 8 characters, contain upper and lower case characters, a special character and a number.');
      return;
    }

    doAjaxREquestPostUpdatePassword({ emailHash, recoveryHash, passwordText1 }).then((res) => {
      console.log(res)
      if (res.status === "OK") {
        $("#change-password-success-message").css('display', 'block').text("Password was changed successfully!")
        $(".login-headlines-back-link").css('display', 'block');
        $('#recover-password-submit-button').css('display', 'none');
      } else {
        $("#change-password-error-message").css({ 'display': 'block', 'color': 'red' }).text('There was a problem updating the password.')
      }
    });
  })
})

function doAjaxREquestPostUpdatePassword(data) {
  return $.ajax({
    type: 'POST',
    url: '/recover',
    data: data
  });
}

/**
   *
   * @param {string} pwd Password string to evaluate if it meets requirements
   * @return {boolean}
   */
function passwordSecurityValid(pwd) {
  // Enforcement principles should be a js object
  // { captialLetters: true or false }
  // { specialCharacters: true or false }
  // { numberRequired: true or false }
  const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
  return regEx.test(pwd);
}

/**
 *
 */
function clearValidationErrorMessage() {
  $('#change-password-error-message').text('').css('display', 'none');
  $('#recover-password-submit-button').attr('disabled', false);
}
