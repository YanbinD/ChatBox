const path = require('path');
const http = require('http');  // >> 3. import http module for integrating Socket.io
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
// >> 1: instead of doing just `__dirname+ /../public` which goes in and out of the server directory 
// use the `path` module : only shows a resulting path instead of all the intermediate path, also result in a cross os compatible path 
const publicPath = path.join(__dirname, '../public');

const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);   // >> 4. Create a HTTP server using Express 

// >> 5: tell socket.io which server to use 
var io = socketIO(server); 

// >> 2: use `app.use` to configure express static middleware 
// for serving all the static assets:  http://localhost:3000/images/kitten.jpg the file exist in the public directory
// ref: https://expressjs.com/en/starter/static-files.html
app.use(express.static(publicPath));

//io.on() is the event listener on the server side, listen for a new client that connect to the server 
//it will listen if a user is connected and perform serverside logic 
/* socket argument in the call back functio represent the the connected socket 
instead of all the users that connected to the server  */
io.on('connection', (socket) => {
	console.log('New user connected'); //log the message when a client is connected

	// ===== Emit to sends the greeting message =====
	// ** socket.emit() will create a event here on the server side ** 
	// **    ** 
	//    first argument; the name of the event
	//    Second argument: not necessary if we dont want to pass any data 
	//                     but here we want to send a message, so it's likely to be an object 
	socket.emit('newMessageFromServer', generateMessage('Admin', 'Welcome to the chat app'));

	// ===== Emit to notify new entry in the chat room =====
	// ** boadcasting needs to be speficied with a individual socket ** 
	//  so the broadcasd know which socket is exclude from the emit 
	socket.broadcast.emit('newMessageFromServer', generateMessage('Admin', 'New user joined'));

	// ===== Listen to the `messageFromClient` from client =====
	socket.on('messageFromClient', (message, callback) => {

		// ******* The `messageFromClient` emitter from the client side sends two argument 
		// 1: message object, 2: a callback function (named callback here)
		console.log('messageFromClient: ', message);

	// --- ** io.emit ** emits an event to every single connection, --- 
	//  --- while ** socket.emit ** emits an event to a single conection --- 
	//  first arguement: the evenet that you want to emit 
	//  second arguemnt: the data that you want to send along in the event 
	// ===== Emit the message received from client to other clients: display the message to everyone (including the sender) in the chat room 
		io.emit('newMessageFromServer', generateMessage(message.from, message.text));
	
		// ******* EVENT ACKNOLEDGMENT ******* 
		callback("Server got it");
		// this will send an event back to the client side where the `newMessageFromServer` is emitted 
		// and the call back function in the emitter will be called 
		

		// socket.broadcast.emit('newMessage', {
	//   from: message.from,
	//   text: message.text,
	//   createdAt: new Date().getTime()
	// });
	});

	// ==== GEO location ==== 
	socket.on('location-from-client', (coords) => {
		io.emit('newMessageFromServer', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
	});

	//event listener when a client is disconnected from the server 
	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});

server.listen(port, () => {
  console.log(`Server is up on ${port}`);
});


// io.on('connection') 
// socket.on('connect')