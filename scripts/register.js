  document.getElementById("registration-form").onsubmit = (e) => {
    e.preventDefault();
    
    // Assign the form to variables
    const registrationEmail = document.getElementById("email_address").value;
    const passwordText1 = document.getElementById("pwd1").value;
    const passwordText2 = document.getElementById("pwd2").value;

    // Validate e-mail

    if(!ValidateEmail(registrationEmail)) {
      $("#validation-error").text('Enter a valid e-mail address.').css("display", "block");
      return;
    }
    // Password must be at least 8 characters
    if (!passwordSecurityValid(passwordText1)) {
      $("#validation-error").text('Password should be minimum 8 characters, contain upper and lower case characters, a special character and a number.').css("display", "block");
      return;
    }

    if (passwordText1 !== passwordText2) {
      // Display an error, the password texts must match
      $("#validation-error").text('Please enter matching passwords').css("display", "block");
      return;
    }	

    // Validation has passed. Send an ajax request to the server with registration info.
    const serializedData = $("#registration-form").serialize();
    $("#validation-error-space").css('display', 'none');
    $.ajax({
      type: "POST",
      url: "/register",
      data: serializedData,
      dataType: 'json',
			success: function(responseData) {
				window.location = responseData.response;
			},
      	
      done: (zdata) => {
        console.log("zdata", zdata);
      },
      error: (err) => {
        console.log("Line 40 ERROR", err);
        if (err) {
          $("#validation-error-space").text(err.responseJSON || "Error registering account.").css('display', 'block').css('color', 'red');
        }
      }
    });
  };

  // Clears 
  $("#email_address").on('click', (e) => {
    // Make the error disappear
    clearValidationErrorMessage();
  });

  $("#pwd1").on('click', (e) => {
    // Make the error disappear
    clearValidationErrorMessage();
  });

  $("#pwd2").on('click', (e) => {
    // Make the error disappear
    clearValidationErrorMessage();
  });

  function clearValidationErrorMessage () {
    $("#validation-error").text('').css("display", "none");
  }

  function passwordSecurityValid(pwd) {
    // Enforcement principles should be a js object
    // { captialLetters: true or false }
    // { specialCharacters: true or false }
    // { numberRequired: true or false }
    let regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$/;
    return regEx.test(pwd);
  }

  function ValidateEmail(email) 
  {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
  }