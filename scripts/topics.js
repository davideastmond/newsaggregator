// This module handles the topics list and sending data re: the list to the server

$(document).ready(function() {
    $(".delete-button").click((e) => {
      testClick(e);
    });
});

function buildNewTopicList(iTopics) {
  // This method is going to reconstruct the list of topics. 
  // Input is an array of strings (each a topic)

  // First we clear the container
  
  //const db = $(".delete-button").detach();
  const lb = $(".list-group-item").detach();

  $(".list-group-item").bind('click', testClick);
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
  const $closeIcon = $("<span>").addClass("badge delete-button badge-danger").text("×").attr('id', i_index).click(testClick);
  
  $listItem.append($closeIcon);

  return $listItem;
}

function testClick (e) {
  console.log("Test click!");
  console.log('delete-button clicked!');
  const etd = e.target.id;
  const topicsList = $("#ul-topics");
  const arrOfTopics = [];
  
  // Get the target topic
  const targetTopic = topicsList[0].children[etd].dataset.caption;

  // Create a new array of topics, excluding the deleted topic.
  for (let i = 0; i < topicsList[0].children.length; i++) {
    if (topicsList[0].children[i].dataset.caption !== targetTopic) {
      arrOfTopics.push(topicsList[0].children[i].dataset.caption);
    }
  }

  // Should be a filtered array
  console.log(arrOfTopics);
  buildNewTopicList(arrOfTopics);
}

