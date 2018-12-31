const path = require("path");
const http = require("http"); // >> 3. import http module for integrating Socket.io
const express = require("express");
const socketIO = require("socket.io");
const { generateMessage, generateLocationMessage } = require("./utils/message");
const { isRealString } = require("./utils/validation");
const { Users } = require("./utils/users");
// >> 1: instead of doing just `__dirname+ /../public` which goes in and out of the server directory
// use the `path` module : only shows a resulting path instead of all the intermediate path, also result in a cross os compatible path
const publicPath = path.join(__dirname, "../public");

const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app); // >> 4. Create a HTTP server using Express

// >> 5: tell socket.io which server to use
let io = socketIO(server);
let users = new Users ();
// >> 2: use `app.use` to configure express static middleware
// for serving all the static assets:  http://localhost:3000/images/kitten.jpg the file exist in the public directory
// ref: https://expressjs.com/en/starter/static-files.html
app.use(express.static(publicPath));

//io.on() is the event listener on the server side, listen for a new client that connect to the server
//it will listen if a user is connected and perform serverside logic
/* socket argument in the call back functio represent the the connected socket 
instead of all the users that connected to the server  */
io.on("connection", socket => {
  console.log("New user connected");

  socket.on("join", (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback("Name and room name are required.");
    }
	// --------------- implementation for rooms -----------------
	socket.join(params.room);
	// --------implementation for Participant's list --------
	users.removeUser(socket.id); //remove the user from previous room 
	users.addUser(socket.id, params.name, params.room);// add the joined user to the List 
	
	io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    // ===== Emit to notify new user in the chat room =====
    socket.emit(
      "newMessageFromServer",
      generateMessage("Admin", "Welcome to the chat app")
    );
    // ===== Emit to notify new entry in the chat room =====
	socket.broadcast
	.to(params.room)
	.emit(
      "newMessageFromServer",
      generateMessage("Admin", `${params.name} has join the chat room: ${params.room} `)
    );
    callback(); // not passing anything if no error
  });

  // ===== Listen to the `messageFromClient` from client =====
  socket.on("messageFromClient", (message, callback) => {
    console.log("messageFromClient: ", message);
    // ===== Emit the message received from client to other clients: display the message to everyone (including the sender) in the chat room
    io.emit(
      "newMessageFromServer",
      generateMessage(message.from, message.text)
    );
    // ******* EVENT ACKNOLEDGMENT *******
    callback("Server got it");
  });

  // ==== Listen for the location message ====
  socket.on("location-from-client", coords => {
    io.emit(
      "newLocationMessageFromServer",
      generateLocationMessage("Admin", coords.latitude, coords.longitude)
    );
  });

  //event listener when a client is disconnected from the server
  socket.on("disconnect", () => {
	const user = users.removeUser(socket.id);

	if (user) {
		io.to(user.room)
		.emit('updateUserList', users.getUserList(user.room));
		io.to(user.room)
		.emit("newMessageFromServer",
		generateMessage("Admin", `${user.name} has left the chat room: ${user.room} `)
		);
	}
    console.log("User was disconnected");
  });
}); // end io.on()

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
