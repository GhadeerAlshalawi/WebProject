const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const bcrypt = require("bcrypt")
const io = require("socket.io")(server);
const publicfold=path.join(__dirname,'/public');
app.use(express.static(__dirname + '/public'));
var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
const session = require("express-session");

app.use(
  //registers a session middleware with the Express application. 
  //This middleware will store session data in memory or a persistent store, such as a database.
  session({
    //The secret is used to encrypt the session data.
    secret: "your-secret-key",
    //The resave specifies whether the session data should be saved to the persistent store after every request.
    resave: false,
    //The saveUninitialized specifies whether the session data should be saved to the persistent store even if it has not been modified.
    saveUninitialized: true,
  })
);



// imports the User and Message classes from the DB.js file.
const { User, Message } = require("./public/DB");
let socketid;

// Socket.IO event listener It will listen for two events connection.
io.on("connection", function (socket) {
  // Socket.IO event listener It will listen for event newuser.
  socket.on("newuser", function (username) {
    //assigns the user's socket ID to the variable socketid. 
    //The socket ID is a unique identifier for the user's connection to the server.
    socketid = socket.id;
    //log the user's socket ID to the console
    console.log(socketid);
    //emit an update event to all other connected users. 
    //The update event will contain the username of the new user who joined the conversation.
    socket.broadcast.emit("update", username + " joined the conversation");
  });
  // Socket.IO event listener It will listen for event exituser.
  socket.on("exituser", function (username) {
    //emit an update event to all other connected users. 
    //The update event will contain the username of the user who left the conversation.
    socket.broadcast.emit("update", username + " left the conversation");
  });
  //takes a recipient username as its argument and returns a socket ID. 
  async function getRecipientSocketId(recipientUsername) {
    try {
      //find the user with the specified username. 
      //The findOne method returns a promise.
      const recipient = await User.findOne({ username: recipientUsername });
      //if the user was found. 
      if (recipient) {
        //return the user's socket ID.
        return recipient.socketId;
      } else {//if the user was not found.
        return null;
      }
    } catch (error) {//if there is an error.
      //log the error to the console.
      console.error("Error retrieving recipient socket ID:", error);
      return null;
    }
  }
  // Socket.IO event listener It will listen for event chat.
  socket.on("chat", async function (message) {
    //get the recipient socket ID using the getRecipientSocketId function.
    const recipientSocketId = await getRecipientSocketId(message.recipient);
    //log the recipient socket ID to the console.
    console.log(recipientSocketId);
    //check if the recipient socket ID is not null.
    if (recipientSocketId) {
      // Emit the message to the intended recipient
      io.to(recipientSocketId).emit("chat", message);
      console.log("in if statement");
    }
    //socket.broadcast object emit a chat event to all other connected users. 
    //The chat event will contain the chat message that was sent by the user.
    socket.broadcast.emit("chat", message);

    // Create a new Message document
    const newMessage = new Message({
      //the user who send the message
      user: message.username,
      //the message content
      msgs: message.text,
      //the reciver
      recipient: message.recipient,
    });

    console.log("on chat");
    console.log(message);
    console.log(newMessage);

    try {
      // Save the new Message document
      await newMessage.save();
    } catch (error) {//catches any errors that occur while Saveing the new Message.
      //logs the error to the console.
      console.error("Error saving message:", error);
    }
  });

  //Socket.IO event handler that listens for the retrieveSavedMessages event.
  socket.on("retrieveSavedMessages", async function (username) {
    try {
      //tries to get the user's saved messages using the find method.
      const savedMessages = await Message.find({ recipient: username });
      //emit the user's saved messages to the user. 
      socket.emit("savedMessages", savedMessages);
    } catch (error) {//catches any errors that occur.
      //logs the error to the console.
      console.error("Error retrieving saved messages:", error);
    }
  });
});
	
	


// Routes
//creates a new app.get() route that listens for requests to the / path.
app.get("/", (req, res) => {
  //sends the index.html file located in the current directory to the user. 
  res.sendFile(__dirname + "/index.html");
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(publicfold, "register.html"));
});
//handle POST requests to the /register route.
app.post("/register", async (req, res) => {
  try {
    //get the username and password from the request body.
    const { username, password } = req.body;

    // Check if the username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {//check if the existingUser variable is not null.
      //redirects the user to the / path with the error=taken query string.
      return res.redirect("/?error=taken");
    }

    // hashes the password using the bcrypt algorithm with a cost factor of 10.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with username and hashedPassword
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    // Update the socketid for the newly registered user

    //redirects the user to the / path
    res.redirect("/");
  } catch (error) {//If the user registration fails, the catch block is executed. 
    //logs the error to the console.
    console.error("Error registering user:", error);
    //sends an error response to the user.
    res.status(500).send("Internal Server Error");
  }
});
//handle POST requests to the /login route.
app.post("/login", async (req, res) => {
  try {
    //get the username and password from the request body.
    const { username, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {//checks if the user object is not defined. 
      //redirects the user to the / path with the error=taken query string.
      return res.redirect("/?error=unkown");
    }

    // Compare the passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {//if dosen't match 
      //redirects the user to the / path with the error=taken query string.
      return res.redirect("/?error=invalid"); // Redirect to the login page with error parameter
    }

    // Set user session
    req.session.user = {
      username: user.username
    };

    
    //redirects the user to the / path
    res.redirect("/")
  } catch (error) {//catches any errors that occur while logging in.
    //logs the error to the console.
    console.error("Error logging in:", error);
    //sends an Internal Server Error response to the client.
    res.status(500).send("Internal Server Error");
  }
});

//route handler for the /protected route.
app.get("/protected", (req, res) => {
  // Check if user is logged in
  if (!req.session.user) {
    //returns a 401 Unauthorized status code and the message "Unauthorized".
    return res.status(401).send("Unauthorized");
  }
  //else sends the message "Protected route" to the client.
  res.send("Protected route");
});


	  
//starts the Express server on port 5000.
server.listen(5000, () => {
  //logs a message to the console when the server starts.
  console.log("App is running on Port 5000");
});
