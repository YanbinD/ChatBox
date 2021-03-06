//io() is the library available from the socket.io library
//when we call it, we are making the request form the client to the
//server to open up a webSocket and keep that connection open
let socket = io();

//*** socket.on() is the event listener on the client side which allow  */
//**** console.log() here will print ot he chrome console  */

//fire up when the server comes online (listen for a connected server)
socket.on("connect", function() {
  // console.log("Connected to server");
  const params = jQuery.deparam(window.location.search);
  socket.emit('join', params, function (err) {
    if (err) {
      window.location.href= '/'; //redirect back to the homepage 
      alert(err);
    } 
  }) 
});

//fire up when the server goes down (listen for a disconnected server)
socket.on("disconnect", function() {
  console.log("Disconnected from server");
});

// ===== listen for updates of the participants list =====
socket.on('updateUserList', function(users) {
  let ol = jQuery('<ol></ol>');
  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ol);
})


// ===== listen for the `newMessage` event emit from the server =====
socket.on("newMessageFromServer", function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = jQuery('#message-template').html();
  let html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

// ===== Listen for the Location message from server =====
socket.on("newLocationMessageFromServer", function(message) {
  let formattedTime = moment(message.createdAt).format('h:mm a');
  let template = jQuery('#location-message-template').html();
  let html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

// ========= Use JQuery to construct the input-box and SEND out the message  =========
jQuery("#message-form").on("submit", function(event) {
  event.preventDefault(); // ****** prevent the default behavior

  // Default behavior: refresh the page and append the text to the end of url as a query
  const messageTextBox = jQuery("[name=message]");
  // ===== emit the message from the client =====
  socket.emit(
    "messageFromClient",
    {
      from: "User",
      text: messageTextBox.val()
      //select any element which has the name attritube=message and extract the value using the .val() method
    },
    function(message) {
      // ******* EVENT ACKNOLEDGMENT *******  console.log(message);
      messageTextBox.val(""); //clear the value after send
    }
  );
});

// ======= SEND the location message ========
let locationButton = jQuery("#send-location");
locationButton.on("click", function() {
  if (!navigator.geolocation) {
    return alert("Geolaction not support by the browser");
  }
  // disable the send location button after clicked
  locationButton.attr("disabled", "disabled").text("Sending location..."); 
  //getCurrentPosition takes two function as argument, 1: success function, 2: error handler
  navigator.geolocation.getCurrentPosition(
    function(position) { //1: success function,
      // console.log(position);
      locationButton.removeAttr("disabled").text("Send Location"); // re-enable the button after the location is successfully sent
      socket.emit("location-from-client", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    },
    function() { // 2: error handler
      alert("uncable to fetch location");
      locationButton.removeAttr("disabled").text("Send Location");
    }
  );
});

function scrollToBottom () {
  // Selectors by id 
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  // http://api.jquery.com/innerheight/ innerHeight: height of the elemetn after CSS st

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight); //setting the scroll top value 
  }
}
