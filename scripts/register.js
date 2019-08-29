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
    $("#validation-error").text('Password should be 8 characters, contain upper and lower case characters, a special character and a number.').css("display", "block");
    return;
  }

  if (passwordText1 !== passwordText2) {
    // Display an error, the password texts must match
    $("#validation-error").text('Please enter matching passwords').css("display", "block");
    return;
  }	

  // Validation has passed...send an ajax request to the server. Check if e-mail exists
  const serializedData = $("#registration-form").serialize();
  console.log($(this));
  console.log(serializedData);
  $.ajax({
    type: "POST",
    url: "/register",
    data: serializedData,
    success: (data) => {
      // Do something with 
      console.log(data);
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
  let regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,10}$/;
  return regEx.test(pwd);
}

function ValidateEmail(email) 
{
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
}