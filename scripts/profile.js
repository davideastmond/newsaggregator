import { passwordSecurityValid, passwordsMatch } from "./password-security.js";
$(() => {
  /**
   * This function is called when user updates one of their profile attributes.
   * It resets any error messages displayed and sanitizes and validates password input.
   * Finally it sends an AJAX post request to the server w/ to update the info.
   */
  $('#change-profile-submit-button').click((e) => {
    $('#change-password-error-message').css('display', 'none');

    e.preventDefault();

    const $pwd1 = $('#change-password-box-one').val().trim();
    const $pwd2 = $('#change-password-box-two').val().trim();
    const pwdResult = isPasswordValid($pwd1, $pwd2);
    if (pwdResult.result === false) {
      showErrorMessage(pwdResult.message);
      return;
    }

    $('#change-profile-submit-button').attr('disabled', 'true');

    const ajaxPromise = submitPasswordChange();

    ajaxPromise.done(() => {
      showSuccessMessage('Password updated successfully.');
    })
      .fail((data) => {
        showErrorMessage(data.responseJSON.error);
      });
  });

  $("#change-password-box-one").click((e) => {
    hideErrorMessage()
  });
  $("#change-password-box-two").click((e) => {
    hideErrorMessage()
  })
});

/**
 * Allows user to submit a request to change their password.
 * Sends an AJAX post request to the server to update info
 * @return {Promise} Contains the result of a POST request to update user profile info
 */
function submitPasswordChange() {
  return $.ajax({
    url: '/user/:id/profile',
    data: $('#profile-update-password-change-form').serialize(),
    type: 'PUT',
  });
}

/**
 * Displays an error message, formatted for the page
 * @param {string} message
 *
 */
function showErrorMessage(message) {
  $('#change-password-error-message')
    .text(`${message}`)
    .css('display', 'block')
    .css('color', 'red');
}

function hideErrorMessage() {
  $('#change-password-error-message')
    .css('display', 'none')
}
/**
 * Displays a success message when password
 * is successfully changed
 * @param {*} message
 */
function showSuccessMessage(message) {
  $('#change-password-success-message')
    .text(`${message}`).css('display', 'block')
    .css('color', 'green');
}

/**
 *
 * @param {string} first first instance of string password
 * @param {string} second second instance of string password
 * @return {object} object containing a bool and a string message response
 */
function isPasswordValid(firstPasswordInstance, secondPasswordInstance) {
  if (firstPasswordInstance === '' || secondPasswordInstance === '') {
    return { result: false, message: 'Please enter a valid password.' };
  }

  if (!passwordsMatch(firstPasswordInstance, secondPasswordInstance)) {
    showErrorMessage('Please enter a valid password.');
    return { result: false, message: 'Passwords entered do not match.' };
  }

  if (!passwordSecurityValid(firstPasswordInstance)) {
    return { result: false, message: 'Password does not meet security / complexity requirements' };
  }

  return { result: true, message: "OK" };
}
