const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server);

const publicfold=path.join(__dirname,'/public');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, publicfold));
app.use(express.static(__dirname + '/public'));

var bodyParser = require("body-parser")
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))



const { User, Message } = require("./public/DB");


app.get("/public", (req, res) => {
  res.render("index");
});

app.post("/public", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username: username });
    if (existingUser) {
		
			
	  return;
    }

    // Create a new User document
    const newUser = new User({
      username: username,
      password: password
    });

    // Save the new User document
    await newUser.save();

    // Create a new Message document for the welcome message
    const welcomeMessage = new Message({
      user: newUser._id,
      msgs: req.body.msgs
    });

    // Save the welcome message
    await welcomeMessage.save();
	console.log("on post")
  } catch (error) {
    console.log("Error inserting user data:", error);
    res.send("Error inserting user data");
  }
});

const userSockets = new Map();


io.on("connection", function (socket) {
	socket.on("newuser", function (username) {
		userSockets.set(username, socket.id);

	  socket.broadcast.emit("update", username + " joined the conversation");
	});
  
	socket.on("exituser", function (username) {
	  socket.broadcast.emit("update", username + " left the conversation");
	});
	
  
	socket.on("chat", async function (message) {
	  // Find the user by username
	  const user = await User.findOne({ username: message.username });
  console.log(user)
	  if (user) {
		
		// Create a new Message document
		const newMessage = new Message({
		  user: user._id,
		  msgs: message.text
		});
		

		
  
		console.log("on chat")
		console.log(newMessage)
  
		try {
			// Save the new Message document
			await newMessage.save();
	
			// Emit the message to the sender
			socket.emit("chat", {
			  username: message.username,
			  text: message.text,
			});
	
			const userSocketId = userSockets.get(user.username);
			if (userSocketId) {
			  // Emit the message to the specific user
			  io.to(userSocketId).emit("chat", {
				username: message.username,
				text: message.text,
			  });
			}
		  } catch (error) {
			console.error("Error saving message:", error);
		  }
		}
	  });
	});
	  

server.listen(5000, () => {
  console.log("App is running on Port 5000");
});

/*
console.log("befor")
app.post('/public', async (req, res) => {
    console.log("in post")

    const data = {
        username: req.body.username,
        password: req.body.password
    }

    const checking = await collection.findOne({ username: req.body.username })
    

   try{

    if(checking==null){
    await collection.insertMany([data])

    
    }

    else{
     if (checking.password===req.body.password) {
        
        res.render("index")
    }
    else {
        res.send("Incorrect password")
    }
}
    
   }
   catch{
    res.send("wrong inputs")
   }

    
})
*/



