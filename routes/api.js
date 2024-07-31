// Routing for registering and login

// Environment variables
require("dotenv").config();

var express = require('express');
var router = express.Router();

// Better form handling
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

// Get User model
const User = require("../models/User");

const Chat = require("../models/Chat");

// Get bcrypt for password encryption
const bcrypt = require("bcryptjs");



// Registering POST
router.post('/register', async function(req, res, next) {

  // Check if email is already in use
  const data = await User.findOne({email: req.body.email});
  if(data) {
    // If email is found in database
    return res.send("Email already in use");
  } else {
    // Else if email is not in use
    // Encrypt password
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);

    console.log(hash);
    // Save new user into database

    // Get current date
    const d = new Date();
    // Hacky fix to get time in Finnish time
    d.setTime(d.getTime() + (3*60*60*1000));

    new User({
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      email: req.body.email,
      password: hash,
      registerDate: d.toISOString(),
      bio: "No bio set yet"
    }).save()
  }

  res.redirect("/login");
});

// Login POST
router.post('/login', upload.none(), async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(401).json({message: "Invalid credentials"});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({message: "Invalid credentials"});
      }

      // Set user info in session data
      req.session.userId = user._id;
      req.session.email = user.email;
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
      res.redirect('/userhome'); // Redirect to user homepage after successful login
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
});


// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return console.log(err);
      }
      res.redirect("/login");
  });
});



// Get user matches
router.get('/matches', isAuthenticated, async (req, res) => {
  // Get matches of logged in user and through populate get the actual users
  // data (firstName, lastName) from the referenced objectId's (users)
  const user = await User.findById(req.session.userId).populate("matches", "firstName lastName");
  if (!user) return res.status(404).send("User not found");
  res.json(user.matches);
});

// Get chat history with a match
router.get('/chat/:matchId', isAuthenticated, async (req, res) => {
  const { matchId } = req.params;
  const chat = await Chat.findOne({
      // $all means that both values must match (userids)
      participants: { $all: [req.session.userId, matchId] }
      // Then once again use .populate to get the actual data from the object
      // references (objectIds)
  }).populate("messages.sender", "firstName lastName");

  // If a chat was found return its messages
  // and if not return empty array
  if(chat) {
    res.json(chat.messages)
  } else {
    res.json([]);
  }
});

// Send a message to a match
router.post('/chat/:matchId/send', isAuthenticated, async (req, res) => {
  const { matchId } = req.params;
  const { message } = req.body;

  // Again find chat in question by the matchId and logged in userId
  let chat = await Chat.findOne({
      participants: { $all: [req.session.userId, matchId] }
  });

  // If there is no chat yet between them, create one
  if (!chat) {
      chat = new Chat({
          participants: [req.session.userId, matchId],
          messages: []
      });
  }
  // Add new message to chat
  chat.messages.push({
      sender: req.session.userId,
      message
  });
  
  //Save chat into the db
  await chat.save();
  res.json({ success: true });
});


function isAuthenticated(req, res, next) {
  if (req.session.userId) {
      return next();
  } else {
      res.redirect("/login");
  }
}

module.exports = router;
