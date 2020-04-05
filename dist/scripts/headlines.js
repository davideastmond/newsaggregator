"use strict";
$(function () {
    $('#headlines-submit-new-search').on('click', function (e) {
        doHTTPRequest();
    });
    $('#news-results-click-box').on('click', function (e) {
        doHTTPRequest();
    });
    $('#search-box').on('keypress', function (e) {
        if (e.which === 13) {
            doHTTPRequest();
        }
    });
    $('#qSearchBox').on('keypress', function (e) {
        if (e.which === 13) {
            // Submit the query
            doHTTPRequest();
        }
    });
    $('.fa-bookmark').click(function (e) {
        /* The status of the heart icon can only
        change after a successful response from the server */
        if (e.target && e.target.disabled) {
            // If the icon has been clicked and is solid red, abort
            return;
        }
        /* Capture the articles headline text, the article
        url and the thumbnail ref. I have to take into account
        ff the events are being triggered by the feed.ejs or
        headlines.ejs as the DOM hierarchy is different for each */
        var headlineText = e.target.parentNode
            .parentNode
            .parentNode
            .parentNode
            .children[1]
            .children[0].innerHTML;
        var articleURL = e.target.parentNode
            .parentNode
            .parentNode
            .parentNode
            .children[0]
            .href;
        var imageRef;
        if (!e.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0]) {
            imageRef = e.target.parentNode
                .parentNode
                .parentNode
                .parentNode
                .children[0]
                .currentSrc;
        }
        else {
            imageRef = e.target.parentNode
                .parentNode
                .parentNode
                .parentNode
                .children[0]
                .children[0]
                .currentSrc;
        }
        if (!articleURL) {
            articleURL = e.target.parentNode.children[1].children[0].href;
        }
        var favArticleData = { headlineText: headlineText,
            url: articleURL, imageSrc: imageRef };
        // The url we want to save is index[3]
        doUpdateFavoritesAjaxRequest(favArticleData).then(function (result) {
            makeBookMarkIconRed(e);
        });
    });
});
/**
 * Sends an AJAX request to server indicating the
 * article to be added to user's favorites list
 * @param {object} articleInfo An object containing article information
 * @param {string} articleInfo.headlineText The short headline for the article
 * @param {string} articleInfo.url URL for article
 * @param {string} articleInfo.imageSrc URL for thumbnail image
 * @return {Promise} A Promise indicating the completion of the AJAX post request
 */
function doUpdateFavoritesAjaxRequest(articleInfo) {
    return $.ajax({
        type: 'POST',
        url: '/user/:id/bookmarks',
        data: articleInfo,
    });
}
/**
 * Makes the book mark icon disabled and red
 * @param {object} obj DOM element
 */
function makeBookMarkIconRed(obj) {
    obj.target.disabled = true;
    obj.target.classList.toggle('far');
    obj.target.classList.toggle('fas');
    if (obj.target.style.color === 'red') {
        obj.target.style.color = '';
    }
    else {
        obj.target.style.color = 'red';
    }
}
/**
 * Performs a GET request to the server with search inquiry
 */
function doHTTPRequest() {
    var $searchQueryElement = $('#search-box').val();
    var $qSearchBox = $('#qSearchBox').val();
    var mSearch;
    if ($searchQueryElement) {
        if ($searchQueryElement.trim() === '') {
            return;
        }
        else {
            mSearch = $searchQueryElement.trim();
        }
    }
    else if ($qSearchBox) {
        if ($qSearchBox.trim() === '') {
            return;
        }
        mSearch = $qSearchBox.trim();
    }
    var xhr = new XMLHttpRequest();
    var queryDate = moment().format('MM/DD/YYYY');
    var params = "date=" + queryDate + "&newsQuery=" + mSearch;
    xhr.open('GET', '/news' + '?' + params, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'document';
    // Gather the query and the date
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            // Load the page once we get a response
            window.location.href = xhr.responseURL;
        }
    };
    // Send the request
    xhr.send(null);
}
