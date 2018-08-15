const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../../model/User');
const secretOrKey = require('../../config/Keys').secretOrKey;
const registerValidation = require('./joi-validation/joi-register');
const loginValidation = require('./joi-validation/joi-login');

// Register Route
// @ Public Route
router.post('/register', (req, res) => {
  const { name, email, password, photo } = req.body;
  // Joi Validation
  registerValidation(req.body, res);
  // lets find if user already exist. we have local model Schema nested in local { }. for nested search needs commas i.e "local.email"
  // check this youtube channel videos for more details on full auth with JWT 4 local, google and fb. https://www.youtube.com/watch?v=zx6jnaLuB9Q&list=PLSpJkDDmpFZ7GowbJE-mvX09zY9zfYatI
  User.findOne({ 'local.email': email }).then(user => {
    if (user) {
      return res
        .status(400)
        .json({ Email: 'Email is already Used for other Account ' });
    }
    // check User in model, there is method implemented to seperate local/google/fb users, we add method:"local" with new user.
    const newUser = new User({
      method: 'local',
      local: {
        name,
        email,
        password,
        photo
      }
    });
    // lets encrypt our password with bcrypt, always use newUser.local.xxxxx to reach nested user property in local.
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.local.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.local.password = hash;
        newUser
          .save()
          .then(user => {
            res.json({
              name: user.local.name,
              email: user.local.email,
              id: user.id,
              photo: user.local.photo
            });
          })
          .catch(err => {
            console.log(err);
          });
      });
    });
  });
});

// LOGIN Route
// @ Public Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Joi Validation
  loginValidation(req.body, res);
  // mongoose find for nested property will be defined like User.findOne({"local.email"}) to match email
  User.findOne({ 'local.email': email }).then(user => {
    if (!user) {
      return res.send(404).json({ Error: 'User not Found' });
    }
    bcrypt
      .compare(password, user.local.password)
      .then(isMatch => {
        if (isMatch) {
          // Json web Token --- Creation ---- Create a payload which includes all the required info.
          const payload = {
            // id of user is not nested but other properties are ... add method as well to seperate local users in frontEnd
            // for password reset link. if user is local provide it password reset link, and send email verification link as well.
            id: user.id,
            method: user.method,
            name: user.local.name,
            email: user.local.email,
            photo: user.local.photo
          };
          jwt.sign(payload, secretOrKey, { expiresIn: '24h' }, (err, token) => {
            console.log({ token: 'Bearer ' + token });
            res.json({ token: 'Bearer ' + token });
          });
        } else {
          res.status(400).json({ password: 'wrong password' });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });
});

// Google 0auth Token Login ---- passport-google-plus-token Strategy
//https://developers.google.com/oauthplayground   to get access_token for testing.
router.post(
  '/google',
  passport.authenticate('googleToken', { session: false }),
  (req, res) => {
    // return console.log(req.user);
    // jwt Token creation
    const payload = {
      id: req.user._id,
      method: req.user.method,
      name: req.user.google.name,
      email: req.user.google.email,
      photo: req.user.google.photo,
      date: req.user.date
    };
    // return console.log(payload);
    const token = jwt.sign(
      payload,
      secretOrKey,
      { expiresIn: '24h' },
      (err, token) => {
        console.log({ token: 'Bearer ' + token });
        res.json({ token: 'Bearer ' + token });
      }
    );
  }
);
// Facebook 0auth Token Login ---- passport-google-plus-token Strategy
// https://developers.facebook.com/tools/explorer   access_token with email
// https://developers.facebook.com/tools/accesstoken/ --- only access_token for testing.
// check facebook access_token in header Key: Authorization and Value: Bearer + token ... it doesnt work the way as google in body ..
router.post(
  '/facebook',
  passport.authenticate('facebook-token', { session: false }),
  (req, res) => {
    // jwt Token creation
    const payload = {
      id: req.user._id,
      method: req.user.method,
      name: req.user.facebook.name,
      email: req.user.facebook.email,
      photo: req.user.facebook.photo,
      date: req.user.date
    };
    // return console.log(payload);
    const token = jwt.sign(
      payload,
      secretOrKey,
      { expiresIn: '24h' },
      (err, token) => {
        console.log({ token: 'Bearer ' + token });
        res.json({ token: 'Bearer ' + token });
      }
    );
  }
);
// current_user Route
// @ Private Route
// check all the passport authentications at once, if user is local it will log it in via local, if google will go through google or facebook.
router.get(
  '/current_user',
  // Mulitple passport.authentication methods.
  passport.authenticate(['jwt', 'googleToken', 'facebook-token'], {
    session: false
  }),
  // passport.authenticate('googleToken', { session: false }),
  (req, res) => {
    console.log('req.user', req.user);
    res.json({ user: 'Top Secret Docs only for Authenticated Users.' });
  }
);

module.exports = router;
