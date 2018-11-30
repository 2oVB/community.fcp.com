let name;
let password;

let socket = io();

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

    if(getCookie('logged-in') == true) {
      window.location = 'http://localhost:3000/dashboard'
    }   if(getCookie('logged-in') == false) {
      window.location = 'http://localhost:3000'
    }   
  



document.getElementById('login-btn').onclick = () => {
  event.preventDefault();

  document.cookie = "logged-in=" + $('.logged_in:checked').val() + "; expires=Thu, 18 Dec 2100 12:00:00 UTC; path=/";


  name = document.getElementById('nameInput').value;
  password = document.getElementById('passwordInput').value;

  
  socket.emit('login', name, password);
}

socket.on('login_work', () => {
    document.location = 'http://localhost:3000/dashboard'
})

