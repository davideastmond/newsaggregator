// This module handles the topics list and sending data re: the list to the server

$(document).ready(function() {
    // Delete button clicked
    $(".delete-button").click((e) => {
      processDeleteTopic_Click(e);
    });

    // Add topic button clicked
    $("#add-topic-button").click((e) => {
      processAddTopic_Click(e);
    });

    // Save the new topics by means of a post request to server
    $("#save-topic-button").click((e) => {
      // Ajax request like
      saveTopicDataToServer();
    });
});

function rebuildTopicList(iTopics) {
  // This method is going to reconstruct the list of topics. 
  // Input is an array of strings, (each a topic)

  // First we clear the container
  const lb = $(".list-group-item").detach();

  // Bind click events to the list group item (TODO: not sure if needed)
  $(".list-group-item").bind('click', processDeleteTopic_Click);

  // Iterate through each topic and create an HTML element li with an embedded span (x close button)
  iTopics.forEach((elementTopic, index) => {
    let $topicElement = makeIndividualTopicListItem(elementTopic, index);
    $("#ul-topics").append($topicElement);
  });
}

function makeIndividualTopicListItem(itemName, i_index) {
  // Item name is a string
  if (typeof(itemName) !== 'string') {
    throw error("itemName must be of type string");
  }
  
  const $listItem = $("<li>").addClass("list-group-item button-to-right").attr('data-caption', itemName).text(itemName);
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
  const targetTopic = $("#topic-to-add").val();
  // Get the current state
  const currentList = getTopicListFromDOM();
  if (!currentList.includes(targetTopic)) {
    currentList.push(targetTopic);
  }
  rebuildTopicList(currentList);
}

function saveTopicDataToServer () {
  // This sends an ajax HTTP request to server, update database
  const listFromDOM = getTopicListFromDOM();
  let myData = { newTopic: listFromDOM };
  $("#save-topic-button").attr('disabled', true);
  $.ajax({
    type: 'POST',
    url: "/user/user/topics/update",
    data: { newTopics: listFromDOM } ,
    success: $("#save-topic-button").attr('disabled', false),
    fail: null,
  });
}