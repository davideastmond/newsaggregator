
document.getElementById("header-top-nav-logout-link").onclick = (e) => {
  // Send an ajax POST request to /logout to log the user out
  doLogout();
};

document.getElementById("header-top-nav-logout-link-menu-click").onclick = (e) => {
  doLogout();
};

const doLogout = ()=> {
	$.ajax({
    type: "POST",
    url: "/logout",
    data: { message: 'log out'},
    success: (res) => {
      window.location = "/";
    },
    error: (err) => {
      alert('There was an error sending the request');
    }
  });
};