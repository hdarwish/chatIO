const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var usernames = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
  console.log("HI");
});

io.on("connection", function(socket) {
  // send a message
  socket.on("chat message", function(data) {
    io.emit("new message", { msg: data, user: socket.username });
  });

  socket.on("new user", function(data, cb) {
    if (usernames.indexOf(data) != -1) {
      cb(false);
    } else {
      cb(true);
      socket.username = data;
      usernames.push(socket.username);
      updateUsernames();
    }
  });
  //update usernames
  function updateUsernames() {
    io.emit("usernames", usernames);
  }

  socket.on("disconnect", function(data) {
    if (!socket.username) return;
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });
});

http.listen(process.env.PORT || 3000, () => {
  console.log("listening on 3000");
});
