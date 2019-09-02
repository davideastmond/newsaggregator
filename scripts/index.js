$(document).ready(()=> {
  // Bind the datepicker to the text input
	$("#date").datepicker();
	

});

document.getElementById("news-query-form").onsubmit = (e) => {
  // Submit a post request. Create a HTTP Request
  e.preventDefault();
  const xhr = new XMLHttpRequest();
  const newsQuery = document.getElementById("news-topic").value.trim();
  const queryDate = document.getElementById("date").value.trim();
  let params = `date=${queryDate}&newsQuery=${newsQuery}`;
  

  xhr.open("GET", "/news" + "?" + params, true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.responseType = "document";
  
  // Gather the query and the date
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200 ) {
      // Load the page once we get a response
      console.log("URL", xhr.responseURL);
      window.location.href = xhr.responseURL;
     
    }
  };
  // Send the request
  xhr.send(null);
};

// Handle logging out
$("header-top-nav-logout-link").on('click', (e) => {
	alert("clicked the log out link!");
});