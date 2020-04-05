"use strict";
/* This handles deleting the links.
User has clicked the little trash icon for a bookmarked article */
$(function () {
    $('.fa-trash-alt').on('click', function (e) {
        var delUrl = e.target.parentNode
            .parentNode
            .children[0].children[0].children[0].href;
        // Complete an AJAX post request, then refresh the page
        doAjaxRequestDeleteBookmark(delUrl).then(function () {
            window.location = '/user/user/bookmarks';
        })
            .catch(function () {
            window.location = '/';
        });
    });
    $('.btn-clear-all-bookmarks').on('click', function (e) {
        // Sends the ajax command to delete all the bookmarks for this user
        e.target.disabled = true;
        doAjaxRequestDeleteAllBookmarks().then(function (res) {
            window.location = '/user/user/bookmarks';
        })
            .catch(function (err) {
            console.log(err);
        });
    });
    convertMomentDates();
});
/**
 *
 * @param {string} urlToDelete The URL to remove from the bookmark
 * @return {Promise} Ajax request to delete a bookmark
 */
function doAjaxRequestDeleteBookmark(urlToDelete) {
    return $.ajax({
        type: 'DELETE',
        url: '/user/:id/bookmarks/:id',
        data: { url: urlToDelete },
    });
}
/**
 * @return {Promise} A promise indicating that the deletion of
 * all a user's bookmarks will be completed
 */
function doAjaxRequestDeleteAllBookmarks() {
    return $.ajax({
        type: 'DELETE',
        url: '/user/:id/bookmarks',
        data: { command: 'delete all' },
    });
}
/**
 * A DOM helper function that converts date elements
 * in the bookmark-date class into friendly readable date formats using moment.js
 *
 */
function convertMomentDates() {
    var domObjectArray = document.getElementsByClassName('bookmark-date');
    for (var i = 0; i < domObjectArray.length; i++) {
        var bookmarkDate = new Date(domObjectArray[i].innerHTML);
        domObjectArray[i].innerHTML = bookmarkDate.toDateString('YYYY/MM/DD hh:mm');
    }
}
