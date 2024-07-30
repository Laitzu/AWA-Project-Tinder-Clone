var express = require('express');
var router = express.Router();

// Required packages and stuff
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const {body, validationResult} = require("express-validator");

// Get User model
const User = require("../models/User");


// Get logged in users own profile info
router.get('/me', isAuthenticated, async (req, res, next) => {

  console.log(req.session.userId);

  const user = await User.findOne({_id: req.session.userId});

  res.redirect("/users/profile/" + user._id);
});


// Get any users profile info
router.get('/profile/:id', isAuthenticated, async (req, res, next) => {

  console.log(req.session.userId);

  const user = await User.findOne({_id: req.session.userId});

  console.log(user);

  res.json(user)
});


// Get a random users profile
router.get('/random', isAuthenticated, async (req, res, next) => {
  let user;
  while(true) {
    // Get one random user from db
    user = await User.aggregate().sample(1);
    // Check that the user is not getting themselves


    //
    //
    // ALSO ADD LOGIC HERE SO THAT YOU DONT GET SOMEONE YOU HAVE ALREADY LIKED OR DISLIKED
    //
    //

    // TODO:
    // ADD PROFILE EDITING
    // ADD LIKES / DISLIKES TO DATABASE
    // ADD CHATTING WHEN LIKES MATCH (DISPLAY ALL LIKE PAIRS IN CHAT ALREADY AND
    // IF NO MESSAGES YET DISPLAY SOMETHING LIKE "START CHATTING YOU MATCHED")
    // AFTER THIS THE MANDATORY REQUIREMENTS ARE DONE!!!!!!!!!!

    if(user._id !== req.session.userId) {
      return res.json(user);
    }
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
