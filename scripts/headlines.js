$(() => {
  $("#headlines-submit-new-search").on('click', (e) => {
    doHTTPRequest();
  });
  
  $("#news-results-click-box").on("click", (e) => {
    doHTTPRequest();
  });
  
  $("#search-box").on("keypress", (e) => {
    if (e.which === 13) {
      doHTTPRequest();
    }
  });
  
  $("#qSearchBox").on("keypress", (e) => {
    if (e.which === 13) {
      // Submit the query
      doHTTPRequest();
    }
  });

  $('.fa-bookmark').click((e) => {
    // This code needs to be refactored. The status of the heart icon can only change after a successful response from the server
   
      if (e.target && e.target.disabled) {
        return;
      }
    
      e.target.disabled = true;
      e.target.classList.toggle('far');
      e.target.classList.toggle('fas');
      if (e.target.style.color === 'red') {
        e.target.style.color = "";
      } else {
        e.target.style.color = 'red';
      }
    
   
    
    // Capture the articles headline text, the article url and the thumbnail ref
    const headlineText = e.target.parentNode.parentNode.parentNode.parentNode.children[1].children[0].innerHTML;
    const articleURL = e.target.parentNode.parentNode.parentNode.parentNode.children[0].href;
    const imageRef = e.target.parentNode.parentNode.parentNode.parentNode.children[0].children[0].currentSrc;
    console.log(imageRef);
    
   
    // The url we want to save is index[3]
    doUpdateFavoritesAjaxRequest({headlineText: headlineText, url: articleURL, imageSrc: imageRef}).then((result) => {
      
     console.log(result);
    });
    
  });
});

function doUpdateFavoritesAjaxRequest(articleInfo) {
  // This method is going to send an AJAX post request to the server to update the favorites
  return $.ajax({
    type: "POST",
    url: "/user/:id/articles/update",
    data: articleInfo
  });
} 

function doHTTPRequest() {
  const $searchQueryElement = $('#search-box').val();
  const $qSearchBox = $("#qSearchBox").val();
  let mSearch;
  if ($searchQueryElement) {
    if ($searchQueryElement.trim() === '') {
      return;
    } else {
      mSearch = $searchQueryElement.trim();
    }
  } else if ($qSearchBox) {
    if ($qSearchBox.trim() === '') {
      return;
    }
    mSearch = $qSearchBox.trim();
  }

  const xhr = new XMLHttpRequest();
  const queryDate = moment().format("MM/DD/YYYY");
  let params = `date=${queryDate}&newsQuery=${mSearch}`;
  
  xhr.open("GET", "/news" + "?" + params, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.responseType = "document";
  
  // Gather the query and the date
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 ) {
      // Load the page once we get a response
      window.location.href = xhr.responseURL;
    }
  };
  // Send the request
  xhr.send(null);
}