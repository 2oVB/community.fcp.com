const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

require("firebase/firestore");
require("firebase/storage");
const firebase = require('firebase');


let passwordVar;
let nameVar;

firebase.initializeApp({
  apiKey: "AIzaSyBySbUPwRebY4sA8qChW4QRMhwQYoCiuRU",
  authDomain: "fcp-firebase.firebaseapp.com",
  projectId: "fcp-firebase",
  storageBucket: "gs://fcp-firebase.appspot.com",
});

const storage = firebase.storage();
const app_storage = firebase.app().storage("gs://fcp-firebase.appspot.com");
const storageRef = firebase.storage().ref();
const ref = storageRef.child('images');




const db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true,
});

app.use(express.static("public"));

server.listen(process.env.PORT || 3000, () => {
  console.log("fcp listening on port", 3000);
});

function uploadImage(image){
  ref.putString(image, 'base64').then(() => {
    console.log('Image uploaded');
  });
}


app.get("/dashboard", (req, res) => {
  res.use(express.static("public"));
});

io.on("connection", socket => {
  console.log("a user connected");

  socket.on('new message', (name, message) => {
    socket.broadcast.emit('add message', nameVar, message);
    socket.emit('add message', nameVar, message)
  });

  socket.on("new form", (title, question, name, image) => {
    uploadImage(image )
    // console.log(image)
    
    db.collection("community-forms")
      .doc()
      .set({
        name: name,
        title: title,
        question: question,
      })
      .then(function() {
        console.log("Document successfully written!");
        socket.emit('load forms')
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });
  });

  socket.on("load forms", (max, min) => {
    let id;

    db.collection("community-forms")
      .get()
      .then((querySnapshot, req, res) => {
        querySnapshot.forEach(doc => {
          id = doc.id;

          let ref = db.collection("community-forms").doc(id);
          let getDoc = ref
            .get()
            .then(doc => {
              socket.emit("add form", doc.data().title, doc.data().question, doc.data().name);
            })
            .catch(err => {
              console.log("Error getting document", err);
            });
        });
      });
  });



  socket.on("register", (name, password) => {
    db.collection("users")
      .doc()
      .set({
        username: name,
        password: password
      })
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });

    console.log("a user registered");
  });


  socket.on("login", (name, password) => {
    let id;


    db.collection("users")
      .get()
      .then((querySnapshot, req, res) => {
        querySnapshot.forEach(doc => {
          id = doc.id;

          let ref = db.collection("users").doc(id);
          let getDoc = ref
            .get()
            .then(doc => {
              if (!doc.exists) {
                console.log("No such document!");
              } else {
                if (
                  name == doc.data().username &&
                  password == doc.data().password
                ) {
                  dir = false;
                  socket.emit('send data', doc.data().username, doc.data().password)

                  nameVar = doc.data().username;

                  socket.emit("login_work");
                  socket.emit("send user", nameVar);
                } else {
                  console.log("404 not found, the user ");
                }
              }
            })
            .catch(err => {
              console.log("Error getting document", err);
            });
        });
      });
  });
});
