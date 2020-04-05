"use strict";
$(function () {
    $('#header-top-nav-logout-link').click(function (e) {
        // Send an ajax POST request to /logout to log the user out
        doLogout();
    });
    $('#header-top-nav-logout-link-menu-click').click(function (e) {
        doLogout();
    });
});
var doLogout = function () {
    $.ajax({
        type: 'POST',
        url: '/logout',
        data: { message: 'log out' },
        success: function () {
            window.location = '/';
        },
        fail: function () {
            alert('There was an error sending the request');
        },
    });
};
