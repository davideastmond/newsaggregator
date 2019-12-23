$(() => {

  /**
   * This procedure is called when user updates their profile attribute.
   * It resets any error messages displayed and sanitizes and validates password input.
   * Finally it sends an AJAX post request to the server w/ the updated info.
   */
  $("#change-profile-submit-button").click((e) => {

    $("#change-password-error-message").css('display', 'none');

    e.preventDefault(); 
  
    const $pwd1 = $("#change-password-box-one").val().trim();
    const $pwd2 = $("#change-password-box-two").val().trim();
    
    if ($pwd1 === "" || $pwd2 === "") {
      showErrorMessage("Please enter a valid password.");
      return;
    }
   
    if (!ifPasswordsMatch($pwd1, $pwd2)) {
      showErrorMessage("Please enter a valid password.");
      return;
    }
  
    $("#change-profile-submit-button").attr('disabled', 'true');

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
 * Allows user to submit a request to change their password. Sends an AJAX post request to the server to update info
 * @returns {Promise} A promise, the result of a POST request to update user profile info
 */
function submitPasswordChange() {
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