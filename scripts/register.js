document.getElementById('registration-form').onsubmit = (e) => {
  e.preventDefault();

  $('#submit-form').attr('disabled', true);
  // Assign the form to variables
  const registrationEmail = document.getElementById('email_address').value;
  const passwordText1 = document.getElementById('pwd1').value;
  const passwordText2 = document.getElementById('pwd2').value;

  // Validate e-mail

  if (!validateEmail(registrationEmail)) {
    $('#validation-error').text('Enter a valid e-mail address.').css('display', 'block');
    $('#submit-form').attr('disabled', false);
    return;
  }
  // Password must be at least 8 characters
  if (!passwordSecurityValid(passwordText1)) {
    $('#validation-error')
        // eslint-disable-next-line max-len
        .text('Password should be minimum 8 characters, contain upper and lower case characters, a special character and a number.')
        .css('display', 'block');
    $('#submit-form').attr('disabled', false);
    return;
  }

  if (passwordText1 !== passwordText2) {
    // Display an error, the password texts must match
    $('#validation-error')
        .text('Please enter matching passwords').css('display', 'block');
    $('#submit-form').attr('disabled', false);
    return;
  }

  // Validation has passed. Send an ajax request to the server with registration info.
  const serializedData = $('#registration-form').serialize();
  $('#validation-error-space').css('display', 'none');
  const ajaxRegisterRequest = sendRegistrationRequest(serializedData);

  ajaxRegisterRequest.done((responseData) => {
    window.location = responseData.response;
  });

  ajaxRegisterRequest.fail((err) => {
    if (err) {
      $('#validation-error-space')
          .text(err.responseJSON.error || 'Error registering account.')
          .css('display', 'block').css('color', 'red');
      $('#submit-form').attr('disabled', false);
    }
  });
};

// Clears
$('#email_address').on('click', (e) => {
  // Make the error disappear
  clearValidationErrorMessage();
});

$('#pwd1').on('click', (e) => {
  // Make the error disappear
  clearValidationErrorMessage();
});

$('#pwd2').on('click', (e) => {
  // Make the error disappear
  clearValidationErrorMessage();
});

/**
 *
 */
function clearValidationErrorMessage() {
  $('#validation-error').text('').css('display', 'none');
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
   * Returs
   * @param {string} email
   * @return {boolean}
   */
function validateEmail(email) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}

/**
     *
     * @param {object} serializedData
     * @return {Promise} A promise indicating that the request will eventually be resolved
     */
function sendRegistrationRequest(serializedData) {
  // Validation has passed. Send an ajax request to the server with registration info.
  return $.ajax({
    type: 'POST',
    url: '/register',
    data: serializedData,
    dataType: 'json',
  });
}
