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
    const newUser = new User({
      method: 'local',
      local: {
        name,
        email,
        password,
        photo
      }
    });
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
  // Find User with Email and Password from User Model.
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
            id: user.id,
            name: user.local.name,
            email: user.local.email,
            photo: user.local.photo
          };
          jwt.sign(payload, secretOrKey, { expiresIn: '24h' }, (err, token) => {
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

module.exports = router;
