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

    // Submit a password change and refresh page
    const ajaxPromise = submitPasswordChange();

    ajaxPromise.done(()=> {
      window.location = "/user/user/profile";
    })
    .fail((message) => {
      showErrorMessage(message);
    });
  });
});

function ifPasswordsMatch(pwd1, pwd2) {
  return pwd1 === pwd2;
}

function submitPasswordChange() {
  // Essentially makes an AJAX post request to the server and returns a promise
  return $.ajax({
    url: '/user/:id/profile/update',
    data: $("#profile-update-password-change-form").serialize(),
    type: 'POST'
  });
}

function showErrorMessage(message) {
  $("#change-password-error-message").text(`${message}`).css('display', 'block').css('color', 'red');
}