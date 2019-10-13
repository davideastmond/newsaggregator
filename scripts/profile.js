$(() => {

  $("#change-profile-submit-button").click((e) => {
    // Reset the error message
    $("#change-password-error-message").css('display', 'none');
    // The submit button was clicked. We must validate the passwords
    e.preventDefault(); 
  
    // Grab the password text boxes
    const $pwd1 = $("#change-password-box-one").val().trim();
    const $pwd2 = $("#change-password-box-two").val().trim();
    
    if ($pwd1 === "" || $pwd2 === "") {
      showErrorMessage("Please enter a valid password.");
      return;
    }
    // Testing for password match
    if (!ifPasswordsMatch($pwd1, $pwd2)) {
      showErrorMessage("Please enter a valid password.");
      return;
    }

    // Disbale the submit button
    $("#change-profile-submit-button").attr('disabled', 'true');

    // Submit a password change and refresh page
    const ajaxPromise = submitPasswordChange();

    ajaxPromise.done(()=> {
      showSuccessMessage("Password updated successfully");
    })
    .fail((message) => {
      showErrorMessage(message.responseJSON.error);
    });
  });
});

/**
 * Return true if pwd1 === pwd2. Used for checking password security on the front end
 * @param {string} pwd1 
 * @param {string} pwd2 
 * @returns {boolean}
 */
function ifPasswordsMatch(pwd1, pwd2) {
  return pwd1 === pwd2;
}

/**
 * Allows user to submit a request to change their password
 * @returns {Promise} A promise, the result of a POSt request to update user profile info
 */
function submitPasswordChange() {
  // Essentially makes an AJAX post request to the server and returns a promise
  return $.ajax({
    url: '/user/:id/profile/update',
    data: $("#profile-update-password-change-form").serialize(),
    type: 'POST'
  });
}

/**
 * Displays an error message, formatted for the page
 * @param {string} message 
 *
 */
function showErrorMessage(message) {
  $("#change-password-error-message").text(`${message}`).css('display', 'block').css('color', 'red');
}

function showSuccessMessage(message) {
  $("#change-password-success-message").text(`${message}`).css('display', 'block').css('color', 'green');
}