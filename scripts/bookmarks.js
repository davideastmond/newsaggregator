// This handles deleting the links. User has clicked the little trash icon for a bookmarked article
$(()=> {
  $('.fa-trash-alt').click((e) => {

  });
});

/**
 * 
 * @param {string} urlToDelete The URL to remove from the bookmark
 * @returns {Promise} Ajax request to delete a bookmark
 */
function deleteBookmark(urlToDelete) {
  // Sends an ajax request to delete a bookmarked URL from the user's bookmark list
  return $.ajax({
    type: "POST",
    url: "/user/:id/bookmarks/delete",
    data: urlToDelete
  });
}