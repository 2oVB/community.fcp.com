let name;
let password;
document.cookie = "logged_in=true; expires=Thu, 18 Dec 2013 12:00:00 UTC";


let socket = io();

window.onload = () => {
  setTimeout(() => {  
    document.cookie = "logged_in=true"
  }, 1500)
};

document.getElementById('login-btn').onclick = () => {
  event.preventDefault();
  name = document.getElementById('nameInput').value;
  password = document.getElementById('passwordInput').value;


  socket.emit('login', name, password)
}


socket.on('login_work', () => {
  sessionStorage.setItem('fcpauthname', name);
  window.location = 'https://fcp-community.herokuapp.com/dashboard';
})