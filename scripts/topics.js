// This module handles the topics list and sending data re: the list to the server

$(document).ready(function() {
    $(".delete-button").click((e) => {
      processDeleteTopic_Click(e);
    });

    $("#add-topic-button").click((e) => {
      processAddTopic_Click(e);
    });

    // Save the new topics by means of a post request to server
    $("#save-topic-button").click((e) => {
      saveTopicDataToServer();
    });
    
    $("#btn-clear-button").click((e) => {
      clearTopicContainer();
    });
});

function rebuildTopicList(iTopics) {
  clearTopicContainer();
  // Iterate through each topic and create an HTML element li with an embedded span (x close button)
  iTopics.forEach((elementTopic, index) => {
    let $topicElement = makeIndividualTopicListItem(elementTopic, index);
    $("#ul-topics").append($topicElement);
  });
  
  if (iTopics.length > 0) {
    $("#label-no-topics-found").css('display', 'none');
  } else {
    $("#label-no-topics-found").css('display', 'block');
  }
}

function makeIndividualTopicListItem(itemName, i_index) {
  // Item name is a string
  if (typeof(itemName) !== 'string') {
    throw error("itemName must be of type string");
  }
  
  const $listItem = $("<li>").addClass("list-group-item button-to-right").attr('data-caption', itemName.toLowerCase()).text(itemName.toLowerCase());
  const $closeIcon = $("<span>").addClass("badge delete-button badge-danger").text("×").attr('id', i_index).click(processDeleteTopic_Click);
  
  $listItem.append($closeIcon);

  return $listItem;
}

// This handles when the delete x icon is clicked. Starts process of deleting the topic from the array and refreshing the DOM
function processDeleteTopic_Click (e) {
  const etd = e.target.id;

  // Get an array of the current topic lists from the DOM. We can later add or subtract from this list and re-render it in the DOM
  const currentList = getTopicListFromDOM();
  const topicsList = $("#ul-topics");
  // Get the target topic that is to be deleted
  const targetTopic = topicsList[0].children[etd].dataset.caption;

  // Filter out (remove) the topic to be deleted
  const arrOfTopics = currentList.filter((element) => {
    return element != targetTopic;
  });

  // Send the new (filtered array) for re-building in the DOM
  rebuildTopicList(arrOfTopics);
}

function getTopicListFromDOM () {
  // This function converts the current list on screen to an array of strings, 
  // and returns the array. This representation can later be added or subtracted from, then re-rendered in the DOM
  const topicsList = $("#ul-topics");
  const arrOfTopics = [];

  for (let i = 0; i < topicsList[0].children.length; i++) {
    arrOfTopics.push(topicsList[0].children[i].dataset.caption);
  }
  return arrOfTopics;
}

function processAddTopic_Click (e) {
  // Adds topics to the list and then summons a function
  const targetTopic = $("#topic-to-add").val().toLowerCase().trim();
  // Get the current state

  // Disallow empty strings from being entered as topics
  if (targetTopic === "") {
    return;
  }
  const currentList = getTopicListFromDOM();
  if (!currentList.includes(targetTopic)) {
    currentList.push(targetTopic);
    $("#topic-to-add").val('');
  }
  rebuildTopicList(currentList);
}

function saveTopicDataToServer () {
  // This sends an ajax HTTP request to server, update database
  const listFromDOM = getTopicListFromDOM();

  let myData = { topics: JSON.stringify(listFromDOM) };
  $("#save-topic-button").attr('disabled', true);
  $.ajax({
    type: 'POST',
    url: "/user/user/topics/update",
    datatype: 'json',
    data: myData,
    success: function(response) {
      respondToSuccess(response);
    },
    error: function(errorResponse) {
      respondToError(errorResponse);
    }
  });
}

function respondToSuccess (data) {
  // re-enables button and logs response
  $("#save-topic-button").attr('disabled', false); 

  window.location = "/user/user/feed";
  // Redirect to user feed
}

function respondToError (data) {
  throw Error("Not implemented");
}

function clearTopicContainer () {
  // First we clear the container
  $(".list-group-item").detach();

  // Bind click events to the list group item (TODO: not sure if needed)
  $(".list-group-item").bind('click', processDeleteTopic_Click);
}