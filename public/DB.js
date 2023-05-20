const mongoose = require("mongoose");

const url = 'mongodb+srv://Webproject:Qf1AfnfJQZ2DiVV3@cluster0.qqyaoiz.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const usersSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
});

const User = mongoose.model('User', usersSchema);

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  msgs: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model("Message", messageSchema);

module.exports = {
  User: User,
  Message: Message
};
