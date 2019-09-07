// This module handles the topics list and sending data re: the list to the server

$(document).ready(function() {
		$(".delete-button").click((e) => {
			const etd = e.target.id;
			const topicsList = $("#ul-topics");
			const arrOfTopics = [];
			
			// Get the target topic
			const targetTopic = topicsList[0].children[etd].dataset.caption;

			// Create a new array of topics, excluding the deleted topic.
			for (let i = 0; i < topicsList[0].children.length; i++) {
				if (topicsList[0].children[etd].dataset.caption !== targetTopic) {
					arrOfTopics.push(topicsList[0].children[i].dataset.caption);
				}
			}

			// Should be a filtered array
			console.log(arrOfTopics);
			buildNewTopicList(arrOfTopics);
		});
});

function buildNewTopicList(iTopics) {
	// This method is going to reconstruct the list of topics. 
	// Input is an array of strings (each a topic)

	// First we clear the container
	$("#ul-topics").empty();

}

function makeIndividualTopicListItem(itemName) {
	// Item name is a string
	if (typeof(itemName) !== 'string') {
		throw error("itemName must be of type string");
	}
}