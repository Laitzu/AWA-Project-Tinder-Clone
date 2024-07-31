var express = require('express');
var router = express.Router();

// Required packages and stuff
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const {body, validationResult} = require("express-validator");

// Better form handling
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

// Get User model
const User = require("../models/User");


// Get logged in users own profile info
router.get('/me', isAuthenticated, async (req, res, next) => {
  const user = await User.findOne({_id: req.session.userId});
  res.redirect("/users/profile/" + user._id);
});

router.post("/me", isAuthenticated, async (req, res, next) => {

  try {
    const user = await User.findByIdAndUpdate(req.session.userId, {
      firstName: req.body.firstname,
      lastName: req.body.lastname,
      bio: req.body.bio
    });
    res.status(200).json({message: "Profile edit successful"});
  } catch (err) {
    res.status(500).json({message: "Server error"});
  }

  
})


// Get any users profile info
router.get('/profile/:id', isAuthenticated, async (req, res, next) => {
  const user = await User.findOne({_id: req.params.id});
  res.json(user)
});


// Get a random users profile
router.get('/random', isAuthenticated, async (req, res, next) => {

  let user = await User.findOne({_id: req.session.userId});
  while(true) {
    // The following user filtering and choosing code has been provided by ChatGPT 4o
    // Get all users from db not including the user themselves
    const allUsers = await User.find({ _id: { $ne: req.session.userId } });

    // Filter out already liked or disliked users
    const potentialUsers = allUsers.filter(u => 
        !user.likes.includes(u._id) && !user.dislikes.includes(u._id)
    );
    // If there are no filtered potential users, display a message
    if (potentialUsers.length === 0) {
        return res.status(200).json({ message: "No users left, try again later" });
    }

    // Pick a random user from the potential users
    const randomIndex = Math.floor(Math.random() * potentialUsers.length);
    const otherUser = potentialUsers[randomIndex];

    // If likes or dislikes are not initialized yet
    user.likes = user.likes || [];
    user.dislikes = user.dislikes || [];

    return res.json(otherUser);
    }
});


router.post('/like/:id', isAuthenticated, async (req, res, next) => {

  try {
    // Get ids of liker and likee
    const userId = req.session.userId;
    const likedUserId = req.params.id;

    // Also the user objects from db matching the ids
    const user = await User.findById(userId);
    const likedUser = await User.findById(likedUserId);

    // Check if other has liked already => its MATCH!

    if(likedUser.likes.includes(userId)) {
      // Add the match to both users matches
      user.matches.push(likedUserId);
      likedUser.matches.push(userId);

      // Remember to also add the like to the users likes
      user.likes.push(likedUserId);

      // Save users to db
      await user.save();
      await likedUser.save();

      res.json({match: true, matchedUser: likedUser});

    } else {
      // If no match add the like to the users likes nevertheless
      user.likes.push(likedUserId);
      await user.save();

      res.json({message: "Like registered"});
    }

  } catch (err) {
    res.status(500).json({message: "Server error occurred"});
  }
});


router.post('/dislike/:id', isAuthenticated, async (req, res, next) => {

  try {

      // Get ids of disliker and dislikee
      const userId = req.session.userId;
      const dislikedUserId = req.params.id;

      // Get user that is doing the disliking
      const user = await User.findById(userId);

      user.dislikes.push(dislikedUserId);

      // Save users to db
      await user.save();

      res.json({message: "Dislike registered"});

  } catch (err) {
    res.status(500).json({message: "Server error occurred"});
  }
});




function isAuthenticated(req, res, next) {
  if (req.session.userId) {
      return next();
  } else {
      res.redirect('/login');
  }
}

module.exports = router;
