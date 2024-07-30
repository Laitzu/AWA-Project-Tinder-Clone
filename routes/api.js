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
          return res.status(401).send('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).send('Invalid credentials');
      }

      // Set user info in session data
      req.session.userId = user._id;
      req.session.email = user.email;
      req.session.firstName = user.firstName;
      req.session.lastName = user.lastName;
      res.redirect('/userhome'); // Redirect to user homepage after successful login
  } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
  }
});


// Logout handler
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          return console.log(err);
      }
      res.redirect('/login');
  });
});





module.exports = router;
