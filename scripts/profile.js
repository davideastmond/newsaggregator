document.getElementById("change-profile-submit-button").onclick = (e) => {
	// The submit button was clicked. We must validate the passwords
	e.preventDefault(); 

	// Grab the password text boxes
	const $pwd1 = $("#change-password-box-one").val();
	const $pwd2 = $("change-password-box-two").val();

	// Testing for password match
	if (!ifPasswordsMatch) {
		$("#change-password-error-message").text('Please ensure that passwords match').css('display', 'block');
	}
};

function ifPasswordsMatch(pwd1, pwd2) {
	return pwd1 === pwd2;
}

