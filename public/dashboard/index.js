let socket = io();

let title;
let question;

let live_message;

let name;

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// if (getCookie("logged_in") == true) {
//   document.location = "http://localhost:3000";
//   document.cookie = "logged_in=false";
// }

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

    socket.emit("new form", today + ": " + title, question);
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


    socket.emit("new form", today + ": " + title, question);
  }
};

document.getElementById("live-send").onclick = () => {
  if (document.getElementById("live-message").value) {
    event.preventDefault();

    live_message = document.getElementById("live-message").value;

    socket.emit("new message", document.getElementById("live-message").value);
  }
};

socket.on("add message", (name, message) => {
  let li = document.createElement("li");
  li.textContent = "[" + name + "]: " + message;
  li.id = "live-message";

  document.getElementById("live-msgs").appendChild(li);
});
socket.on("add form", (title, question) => {
  let div = document.createElement("div");
  div.id = "form";
  div.className = "form";

  let titleElmnt = document.createElement("h3");
  titleElmnt.textContent = title;

  let questionElmnt = document.createElement("p");
  questionElmnt.textContent = question;

  // let commentElmnt = document.createElement('img');
  // commentElmnt.src = '/style/images/comment.png'
  // commentElmnt.id = "comment";
  // commentElmnt.style.width = '30px';
  // commentElmnt.style.height = '30px';
  // commentElmnt.onclick = () => {
  //   if (state == 0) {
  //     document.getElementById('commentSend').style.display = 'inline';
  //     document.getElementById('commentInput').style.display = 'inline';
      
  //     state = 1;
  //   } else if (state == 1) {
  //     document.getElementById('commentSend').style.display = 'none';
  //     document.getElementById('commentInput').style.display = 'none';
  //     state = 0;
  //   }
  // }

  // let commentInput = document.createElement('input');
  // commentInput.id = 'commentInput';
  // commentInput.type = 'text';
  // commentInput.style.display = 'none';

  // let commentSend = document.createElement('button');
  // commentSend.id = 'commentSend';
  // commentSend.textContent = 'Send comment'
  // commentSend.style.display = 'none'
  // commentSend.className = 'button-primary';

  let spacer = document.createElement("div");
  spacer.id = "spacer";

  
  div.appendChild(titleElmnt);
  div.appendChild(questionElmnt);
  // div.appendChild(commentElmnt)
  // div.appendChild(commentInput) 
  // div.appendChild(commentSend) 
  div.appendChild(spacer);
  document.getElementById("forms").appendChild(div);
});
