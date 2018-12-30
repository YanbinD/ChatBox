
//io() is the library available from the socket.io library 
//when we call it, we are making the request form the client to the 
//server to open up a webSocket and keep that connection open 
var socket = io();

//*** socket.on() is the event listener on the client side which allow  */
//**** console.log() here will print ot he chrome console  */

//fire up when the server comes online (listen for a connected server)
socket.on('connect', function () {
  console.log('Connected to server'); 
});

//fire up when the server goes down (listen for a disconnected server)
socket.on('disconnect', function () {
  console.log('Disconnected from server');

});

// ===== listen for the `newMessage` event emit from the server =====
// first argument: name is the custom event 
// second argument: function that gets called when the event received from the server
socket.on('newMessageFromServer', 
    function (message) {
      console.log('newMessageFromServer: ', message);
      //use Jquery to create a element 
      var li = jQuery('<li></li>'); //create an <li> element 
      // fill in the test for the element created by injection the object values 
      li.text(`${message.from}: ${message.text}` );
      // append the created HTML element to the element where id=message 
      jQuery('#messages').append(li);
    }
);

  jQuery('#message-form').on('submit', function (event) {
    event.preventDefault(); // ****** prevent the default behavior 
    // Default behavior: refresh the page and append the text to the end of url as a query 
    
    // ===== emit the message from the client =====
    socket.emit('messageFromClient', {
      from: 'User',
      text: jQuery('[name=message]').val() 
      //select any element which has the name attritube=message and extract the value using the .val() method 
      }, function (message) {
         // ******* EVENT ACKNOLEDGMENT ******* 
          console.log(message);
      // can implement something like if the connection is down, 
      // create a banner [ connection to server lose 
      }
    );
  }
);

var locationButton = jQuery('#send-location'); 
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolaction not support by the browser');
  }
 //getCurrentPosition takes two function as argument, 1: success function, 2: error handler 

  navigator.geolocation.getCurrentPosition(function(position) {
      // console.log(position);
      socket.emit('location-from-client', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude 
      });
  }, function () {
      alert('uncable to fetch location');
  });
});
