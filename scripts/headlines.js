$("#headlines-submit-new-search").on('click', (e) => {
	const $searchQueryElement = $('#search-box').val();

	if ($searchQueryElement.trim() === '') {
		return;
	}

	const xhr = new XMLHttpRequest();
  const queryDate = moment().format("MM/DD/YYYY");
  let params = `date=${queryDate}&newsQuery=${$searchQueryElement}`;
  

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
});