"use strict";
$(function () {
    /**
     * This function is called when user updates one of their profile attributes.
     * It resets any error messages displayed and sanitizes and validates password input.
     * Finally it sends an AJAX post request to the server w/ to update the info.
     */
    $('#change-profile-submit-button').click(function (e) {
        $('#change-password-error-message').css('display', 'none');
        e.preventDefault();
        var $pwd1 = $('#change-password-box-one').val().trim();
        var $pwd2 = $('#change-password-box-two').val().trim();
        var pwdResult = isPasswordValid($pwd1, $pwd2);
        if (pwdResult.result === false) {
            showErrorMessage(pwdResult.message);
            return;
        }
        $('#change-profile-submit-button').attr('disabled', 'true');
        var ajaxPromise = submitPasswordChange();
        ajaxPromise.done(function () {
            showSuccessMessage('Password updated successfully.');
        })
            .fail(function (data) {
            showErrorMessage(data.responseJSON.error);
        });
    });
});
/**
 * Return true if pwd1 === pwd2. Used for checking password security on the front end
 * @param {string} pwd1
 * @param {string} pwd2
 * @return {boolean}
 */
function passwordsMatch(pwd1, pwd2) {
    return pwd1 === pwd2;
}
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
        .text("" + message)
        .css('display', 'block')
        .css('color', 'red');
}
/**
 * Displays a success message when password
 * is successfully changed
 * @param {*} message
 */
function showSuccessMessage(message) {
    $('#change-password-success-message')
        .text("" + message).css('display', 'block')
        .css('color', 'green');
}
/**
 *
 * @param {string} first first instance of string password
 * @param {string} second second instance of string password
 * @return {object} object containing a bool and a string message response
 */
function isPasswordValid(first, second) {
    if ($pwd1 === '' || $pwd2 === '') {
        return { result: false, message: 'Please enter a valid password.' };
    }
    if (!passwordsMatch($pwd1, $pwd2)) {
        showErrorMessage('Please enter a valid password.');
        return { result: false, message: 'Please enter a valid password.' };
    }
    return { result: true, message: undefined };
}