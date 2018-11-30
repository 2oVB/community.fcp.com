let name;
let password;


let socket = io();

document.getElementById('register-btn').onclick = () => {
  event.preventDefault();
  name = document.getElementById('nameInput').value;
  password = document.getElementById('passwordInput').value;


  socket.emit('register', name, password);
  window.location = 'https://fcp-community.herokuapp.com/'
}

