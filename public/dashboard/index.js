window.onload = () => {
  if (!sessionStorage.getItem('fcpauthname')) {
    window.location = 'https://fcp-community.herokuapp.com';
  }
}

window.onbeforeunload = () => {
  window.sessionStorage.clear();
}


let socket = io();

let title;
let question;

let live_message;

let name;

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
  dd = "0" + dd;
}

if (mm < 10) {
  mm = "0" + mm;
}

today = mm + "/" + dd + "/" + yyyy;

let bool = true;
const parent = document.getElementById("forms");
let length = parent.getElementsByClassName("form");
//runs every second
function run() {
  length = parent.getElementsByClassName("form").length;

  if (bool == true) {
    if (length == 5) {
      document.getElementById("next-page").style.display = "grid";
      bool = false;
    } else {
      document.getElementById("next-page").style.display = "none";
    }
  }
}
setInterval(run, 1);

socket.on("send user", name => {
  window.location = "https://fcp-community.herokuapp.com/dashboard";
  name = name;
  document.getElementById("name").textContent = name;
});

document.getElementById("next-page").onclick = () => {
  event.preventDefault();
};

document.getElementById("go").onclick = () => {
  event.preventDefault();
  socket.emit("load forms", 10, 5);
  document.getElementById("forms-input").style.display = "grid";
  document.getElementById("forum-form").style.display = "none";
  document.getElementById("go").style.display = "none";
  document.getElementById("add-form").style.display = "none";
};

document.getElementById("add-form").onclick = () => {
  if (
    document.getElementById("title").value &&
    document.getElementById("question").value
  ) {
    event.preventDefault();
    document.get
    socket.emit("load forms", 5);

    document.getElementById("forms-input").style.display = "grid";

    title = document.getElementById("title").value;
    question = document.getElementById("question").value;

    document.getElementById("forum-form").style.display = "none";
    document.getElementById("go").style.display = "none";
    document.getElementById("add-form").style.display = "none";

    socket.emit("new form", today + ": " + title, question, sessionStorage.getItem('fcpauthname'));
  }
};

document.getElementById("add-form2").onclick = () => {
  if (
    document.getElementById("title2").value &&
    document.getElementById("question2").value
  ) {
    event.preventDefault();
    document.getElementById("forms").innerHTML = "";
    socket.emit("load forms", 5);

    document.getElementById("forms-input").style.display = "grid";

    title = document.getElementById("title2").value;
    question = document.getElementById("question2").value;


    socket.emit("new form", today + ": " + title, question, localStorage.fcpauthname);
  }
};

document.getElementById("live-send").onclick = () => {
  if (document.getElementById("live-message").value) {
    event.preventDefault();

    live_message = document.getElementById("live-message").value;

    socket.emit("new message", document.getElementById("live-message").value, );
  }
};

socket.on("add message", (name, message) => {
  let li = document.createElement("li");
  li.textContent = "[" + name + "]: " + message;
  li.id = "live-message";

  document.getElementById("live-msgs").appendChild(li);
});
socket.on("add form", (title, question, name) => {
  let spacer = document.createElement('div')
  spacer.id = 'spacer'

  let div = document.createElement("div");
  div.id = "form";
  div.className = "form";

  let nameElmnt = document.createElement('h2');
  nameElmnt.textContent = "By: " + name;

  let titleElmnt = document.createElement("h3");
  titleElmnt.textContent = title;

  let questionElmnt = document.createElement("h4");
  questionElmnt.textContent = question;


  div.appendChild(nameElmnt)
  div.appendChild(titleElmnt);
  div.appendChild(questionElmnt);
  div.appendChild(spacer);
  document.getElementById("forms").appendChild(div);
});
