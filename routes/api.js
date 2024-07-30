require("dotenv").config();

var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {body, validationResult} = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const multer = require("multer")
const storage = multer.memoryStorage();
const upload = multer({storage});

// Test email         asd.asdasd@asd.asd
// Test password      Aas..4aadsj435ja

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router.get('/list', async (req, res, next) => {

  const users = await User.find({});
  res.render("users", {users});
});


router.get('/register.html', (req, res, next) => {
  res.render("register");
});

router.post('/user/register', upload.none(), [
  body('email').isEmail(),
  body('password').isLength({min: 8})
    .matches(/[a-z]/)
    .matches(/[A-Z]/)
    .matches(/[0-9]/)
    .matches(/[\W_]/),
  ], async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({message: "Password is not strong enough"});
    }

  const data = await User.findOne({email: req.body.email});
  console.log(data);
    if(data) {
      return res.status(403).json({message: "Email already in use"});
    } else {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);

      new User({
        email: req.body.email,
        password: hash
      }).save()
      //If registration successful redirect to login page
      return res.json({ redirect: "/login.html" });
    }
  })


router.get('/login.html', (req, res, next) => {
  res.render("login");
});

router.post('/user/login', upload.none(), async (req, res, next) => {

  const user = await User.findOne({email: req.body.email});

  if(!user) {
    return res.status(403).json({message: "Invalid credentials"});
  } else {
    await bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if(err) throw err;
      if(isMatch) {

        const jwtPayload = {
          id: user._id,
          email: user.email,
        }
        jwt.sign(
          jwtPayload,
          process.env.SECRET,
          {
            expiresIn: 300
          },
          (err, token) => {
            // If login successful redirect to index page
            res.json({token: token});
          }
        )
      } else {
        return res.status(403).json({message: "Invalid credentials"});
      }
    });
  }
});

router.get('/private', passport.authenticate('jwt', { session: false }), (req, res) => {
  console.log("Authenticated User:", req.user);
  res.status(200).send({email: req.user.email});
});



module.exports = router;
