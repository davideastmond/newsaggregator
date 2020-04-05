"use strict";
// This module handles the topics list and sending data re: the list to the server
$(function () {
    $('.delete-button').click(function (e) {
        processDeleteTopicClick(e);
    });
    $('#add-topic-button').click(function (e) {
        processAddTopicClick(e);
    });
    // Save the new topics by means of a post request to server
    $('#save-topic-button').click(function (e) {
        saveTopicDataToServer();
    });
    $('#btn-clear-button').click(function (e) {
        clearTopicContainer();
    });
    $('#topic-to-add').focus(function (e) {
        // Clear any error messages.
        $('.error-message-display').css('display', 'none');
        var textBox = document.querySelector('#topic-to-add');
        if (textBox.value.length > 1) {
            textBox.value = '';
        }
    });
});
/**
 * @param {array} iTopics
 */
function rebuildTopicList(iTopics) {
    clearTopicContainer();
    /* Iterate through each topic and create an HTML
    element li with an embedded span (x close button) */
    iTopics.forEach(function (elementTopic, index) {
        var $topicElement = makeIndividualTopicListItem(elementTopic, index);
        $('#ul-topics').append($topicElement);
    });
    if (iTopics.length > 0) {
        $('#label-no-topics-found').css('display', 'none');
    }
    else {
        $('#label-no-topics-found').css('display', 'block');
    }
}
/**
 * @param {string} itemName
 * @param {number} iIndex
 * @return {object} returns a jQuery listItem DOM object
 */
function makeIndividualTopicListItem(itemName, iIndex) {
    // Item name is a string
    if (typeof (itemName) !== 'string') {
        throw error('itemName must be of type string');
    }
    var $listItem = $('<li>')
        .addClass('list-group-item button-to-right')
        .attr('data-caption', itemName.toLowerCase())
        .text(itemName.toLowerCase());
    var $closeIcon = $('<span>')
        .addClass('badge delete-button badge-danger')
        .text('×')
        .attr('id', iIndex)
        .click(processDeleteTopicClick);
    $listItem.append($closeIcon);
    return $listItem;
}
/**
 * This handles when the delete x icon is clicked.
 * Starts process of deleting the topic from the array and refreshing the DOM
 * @function
 * @param {object} e
 *
 */
function processDeleteTopicClick(e) {
    var currentList = getTopicListFromDOM();
    var topicsList = $('#ul-topics');
    var targetTopic = topicsList[0].children[e.target.id].dataset.caption;
    var arrOfTopics = currentList.filter(function (element) {
        return element != targetTopic;
    });
    // the new (filtered array) for re-building in the DOM
    rebuildTopicList(arrOfTopics);
}
/**
 * This function converts the current list on screen
 * to an array of strings, and returns the array.
 * This representation can later be added or subtracted from, then re-rendered in the DOM
 * @function
 * @return {string[]}
 */
function getTopicListFromDOM() {
    var topicsList = $('#ul-topics');
    var arrOfTopics = [];
    for (var i = 0; i < topicsList[0].children.length; i++) {
        arrOfTopics.push(topicsList[0].children[i].dataset.caption);
    }
    return arrOfTopics;
}
/**
 * Builds a list client side of the current topic subscriptions.
 * It disallows empty strings from being entered as topics
 * @param {object} e An event object
 */
function processAddTopicClick(e) {
    // Adds topics to the list and then summons a function
    var targetTopic = $('#topic-to-add').val().toLowerCase().trim();
    if (targetTopic === '' || targetTopic.length > 30) {
        respondToError('Topic entered is not valid. Make sure it is max 30 characters long.');
        return;
    }
    var currentList = getTopicListFromDOM();
    if (!currentList.includes(targetTopic)) {
        currentList.push(targetTopic);
        $('#topic-to-add').val('');
    }
    rebuildTopicList(currentList);
}
/**
 * This function gathers the topics the user desires to subscribe to based on
 * certain DOM elements. It then sends an ajax HTTP request to server
 * to update the database w/ user's topic list
 */
function saveTopicDataToServer() {
    var listFromDOM = getTopicListFromDOM();
    var myData = { topics: JSON.stringify(listFromDOM) };
    $('#save-topic-button').attr('disabled', true);
    $.ajax({
        type: 'PUT',
        url: '/user/user/topics',
        datatype: 'json',
        data: myData,
        success: function (response) {
            respondToSuccess(response);
        },
        error: function (errorResponse) {
            respondToError("Error: " + errorResponse.responseJSON.status);
        },
    });
}
/**
 *
 * @param {object} data // an object representing the value from a successful request.
 */
function respondToSuccess(data) {
    // re-enables button and logs response
    window.location = '/user/user/feed';
    // Redirect to user feed
}
/**
 *
 * @param {string} data
 */
function respondToError(data) {
    $('.error-message-text').text(data).css('color', 'red');
    $('.error-message-display').css('display', 'block');
}
/**
 * Removes event handlers from the elements and then binds new ones
 */
function clearTopicContainer() {
    // First we clear the container
    $('.list-group-item').detach();
    // Bind click events to the list group item (TODO: not sure if needed)
    $('.list-group-item').bind('click', processDeleteTopicClick);
}
