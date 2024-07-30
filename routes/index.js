var express = require('express');
var router = express.Router();


// Required packages and stuff
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const passport = require("passport");
const {body, validationResult} = require("express-validator");

// Get User model
const User = require("../models/User");



/* GET home page. */
router.get('/', isNotAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET register page. */
router.get('/register', isNotAuthenticated, function(req, res, next) {
  res.render('register', { title: 'Express' });
});

/* GET login page. */
router.get('/login', isNotAuthenticated, function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET logged in user homepage */
router.get('/userhome', isAuthenticated, (req, res, next) => {
    res.render("userhome");
});

/* Logout user */
router.get('/logout', isAuthenticated, (req, res, next) => {
  // Destroy the session, so "logout"
  req.session.destroy((err) => {
    if (err) {
      // If an error occurs, display the error in server console and redirect user to homepage
      console.log(err);
      res.redirect("/");
    }
    // Clear the cookie
    res.clearCookie('connect.sid', { path: '/' });
    // Redirect user to homepage after logging out
    res.redirect('/');
  });
});

function isAuthenticated(req, res, next) {
  console.log(req.session.userId);
  if (req.session.userId) {
      return next();
  } else {
      res.redirect('/login');
  }
}

function isNotAuthenticated(req, res, next) {
  if (req.session.userId) {
      res.redirect('/userhome');
  } else {
    return next();
  }
}



module.exports = router;
