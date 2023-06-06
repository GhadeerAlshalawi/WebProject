(function () {
	const app = document.querySelector(".app");
	const socket = io();
  
	let uname;
  
	// On the login page
	//create a new URLSearchParams object from the window.location.search property. 
	//The window.location.search property contains the query string parameters that are appended to the URL.
	const urlParams = new URLSearchParams(window.location.search);
	//get the value of the error query string parameter. 
	//If the error query string parameter is not present, the value of error will be undefined.
	const error = urlParams.get("error");
  
	if (error === "invalid") {
	  // Display the error message to the user
	  alert("Invalid credentials!!");
	}
	if (error === "unkown") {
	  // Display the error message to the user
	  alert("The user does not exist!!");
	}
  
	if (error === "taken") {
	  // Display the error message to the user
	  alert("Username already taken");
	}
	let recipient;
  
	// create a new event handler for the savedMessages event.
	socket.on("savedMessages", function (messages) {
		//check if the messages array is not null and if the length of the messages array is greater than 0.
	  if (messages && messages.length > 0) {
		//iterate over the messages array and calls the function function for each message. 
		//The function is passed the current message as its argument.
		messages.forEach(function (message) {
		  //check if the current user is the sender or recipient of the message.
		  if (message.user === uname || message.recipient === uname) {
			//calling function renderMessage with other message type.
			renderMessage("other", {
			  username: message.user,
			  text: message.msgs,
			});
		  }
		});
	  }
	});
    //event listener that is attached to the join-user button on the join screen.
	//When the button is clicked.
	app.querySelector(".join-screen #join-user").addEventListener("click", function () {
	  //prevents the default action of an event from happening. 
	  //For example, if you have a form with a submit button, the default action of the submit button is to submit the form.
	  event.preventDefault();
	  //get the value of the username that entered by the user.
	  let username = app.querySelector(".join-screen #username").value;
	  //get the value of the recipient that entered by the user.
	  recipient = app.querySelector(".join-screen #recipient-input").value;
	  //If the username is empty, nothing will happen.
	  if (username.length == 0) {
		return;
	  }
	  //else the newuser event will be emitted to the socket with the username as the payload.
	  socket.emit("newuser", username);
	  //The uname variable will be set to the username.
	  uname = username;
	  //The join-screen element will be removed from the active state.
	  app.querySelector(".join-screen").classList.remove("active");
	  //The chat-screen element will be added to the active state.
	  app.querySelector(".chat-screen").classList.add("active");
  
	  // Retrieve the saved messages for the logged-in user
	  socket.emit("retrieveSavedMessages", uname);
	});
    //event listener that is attached to the send-message button on the chat screen. 
	//When the button is clicked.
	app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
	  //prevents the default action of an event from happening. 
	  //For example, if you have a form with a submit button, the default action of the submit button is to submit the form.
	  event.preventDefault();
      //get the value of the message that entered by the user.
	  let message = app.querySelector(".chat-screen #message-input").value;
      //If the message is empty, nothing will happen.
	  if (message.length == 0 || recipient.length == 0) {
		return;
	  }
      //calling function renderMessage with my message type.
	  renderMessage("my", {
		username: uname,
		text: message,
	  });
      //emit with the chat event type, the username, and the message as the arguments.
	  socket.emit("chat", {
		username: uname,
		recipient: recipient,
		text: message,
	  });
      //The value of the message-input element will be set to an empty string.
	  app.querySelector(".chat-screen #message-input").value = "";
	});
    //event listener that is attached to the exit-chat button on the chat screen. 
	//When the button is clicked.
	app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
	  //emit to the socket with the username as the payload.
	  socket.emit("exituser", uname);
	  //The window.location.href property will be set to the current value of the window.location.href property.
		//to get back to previous page.
	  window.location.href = window.location.href;
	});
    //is a listener for the update event. 
	//When the event is emitted, the function will be called with the update as the argument.
	socket.on("update", function (update) {
	  //calling function renderMessage with update type.
	  renderMessage("update", update);
	});
    //is a listener for the chat event. 
	//When the event is emitted, the function will be called with the message as the argument.
	socket.on("chat", function (message) {
	  // Check if the message is intended for the current user
	  if (message.recipient === uname || message.username === uname) {
		//calling function renderMessage with other message type
		renderMessage("other", message);
	  }
	});
  
	function renderMessage(type, message) {
	  //gets the messageContainer element. 
	  //The messageContainer element is the element that contains the messages on the chat screen.
	  let messageContainer = app.querySelector(".chat-screen .messages");
	  //then checks the message type.
	  //If the message type is my.
	  if (type == "my") {
		//creates a div element with the class message my-message.
		let el = document.createElement("div");
		el.setAttribute("class", "message my-message");
		//The function then sets the innerHTML of the div element to the message text. 
		el.innerHTML = `
				  <div>
					  <div class="name">You</div>
					  <div class="text">${message.text}</div>
				  </div>
			  `;
		//The function then appends the div element to the messageContainer element.
		messageContainer.appendChild(el);
	  } else if (type == "other") {//If the message type is other.
		//creates a div element with the class message other-message.
		let el = document.createElement("div");
		el.setAttribute("class", "message other-message");
		//then sets the innerHTML of the div element to the message text.
		//{they should see who send the message so we need the username}.
		el.innerHTML = `
				  <div>
					  <div class="name">${message.username}</div>
					  <div class="text">${message.text}</div>
				  </div>
			  `;
		//then appends the div element to the messageContainer element.
		messageContainer.appendChild(el);
	  } else if (type == "update") {//If the message type is update.
		//creates a div element with the class update. 
		let el = document.createElement("div");
		el.setAttribute("class", "update");
		//then sets the innerText of the div element to the message text.
		el.innerText = message;
		//then appends the div element to the messageContainer element.
		messageContainer.appendChild(el);
	  }
	  // scrolls the chat to the end. This ensures that the user can see the latest message.
	  messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
	}
  })();
  