window.onload = () => {
  if (!sessionStorage.getItem('fcpauthname')) {
    window.location = 'https://fcp-community.herokuapp.com';
  }
}

window.onbeforeunload = () => {
  window.sessionStorage.clear();
}

function startRead(evt) {
  var file = document.getElementById('form-image').value;
  if (file) {
      if (file.type.match("image.*")) {
          getAsImage(file);
          alert("Name: " + file.name + "\n" + "Last Modified Date :" + file.lastModifiedDate);
      }
      else {
          getAsText(file);
          alert("Name: " + file.name + "\n" + "Last Modified Date :" + file.lastModifiedDate);
      }
  }
  evt.stopPropagation();
  evt.preventDefault();
}
function startReadFromDrag(evt) {
  var file = evt.dataTransfer.value;
  if (file) {
      if (file.type.match("image.*")) {
          getAsImage(file);
          alert("Name: " + file.name + "\n" + "Last Modified Date :" + file.lastModifiedDate);
      }
      else {
          getAsText(file);
          alert("Name: " + file.name + "\n" + "Last Modified Date :" + file.lastModifiedDate);
      }
  }
  evt.stopPropagation();
  evt.preventDefault();
}
function getAsImage(readFile) {
  var reader = new FileReader();
  reader.readAsDataURL(readFile);
  reader.onload = addImg;
}
function addImg(imgsrc) {
  var img = document.createElement('img');
  img.setAttribute("src", imgsrc.target.result);
  document.getElementById("body").insertBefore(img);
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

    socket.emit("new form", today + ": " + title, question, sessionStorage.getItem('fcpauthname'), document.getElementById('form-image').value);

    
  }
};

document.getElementById("add-form2").onclick = () => {
  if (
    document.getElementById("title2").value &&
    document.getElementById("question2").value
  ) {
    event.preventDefault();


    document.getElementById("forms-input").style.display = "grid";

    title = document.getElementById("title2").value;
    question = document.getElementById("question2").value;


    document.getElementById("forms").innerHTML = "";
    socket.emit("load forms");
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

let array = [100]

array.slice(10, 20).forEach(() => {
  console.log("eh")
});

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
