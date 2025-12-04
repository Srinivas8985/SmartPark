const loginDetails = {
  "charan": 12345,
  "srinivas": 12345,
  "sathvic": 12345,
  "swaraj": 12345,
  "prasad": 12345,
  "uday": 12345,
  "kiran": 12345,
  "saumya": 12345,
  "vishal": 12345,
  "saumyacharan": 12345,
  "bhargav": 12345,
  "aman": 12345
};

function validateLogin() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;

  if(loginDetails[username] == password) { 
    alert("Login Successful");
    window.location.href="/project1.html";
    return false;
  } else {
    alert("Login Failed");
    return false;
  }
}

function get_details() {
  let username = document.getElementById("username1").value;
  let password = document.getElementById("password1").value;
  
  // Store the username and password in the loginDetails object
  loginDetails[username] = password;
  
  // Alert to display the password corresponding to the entered username
  alert(loginDetails);
}

