const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');
//Email nodemailer config
const nodemailer = require('nodemailer');
const GmailUser = require('../../config/Keys').GmailUser;
const GmailPass = require('../../config/Keys').GmailPass;

const User = require('../../model/User');
const secretOrKey = require('../../config/Keys').secretOrKey;
const registerValidation = require('./joi-validation/joi-register');
const loginValidation = require('./joi-validation/joi-login');

// Register Route
// @ Public Route
router.post('/register', (req, res) => {
  const { name, email, password, password2, photo } = req.body;
  // Joi Validation
  // const { name, email, password, photo } = data;
  const schema = {
    name: Joi.string()
      .regex(/^[a-zA-Z-0-9_ ]{3,30}$/)
      .min(3)
      .max(50)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z-0-9]{6,50}$/)
      .required(),
    password2: Joi.string()
      .regex(/^[a-zA-Z-0-9]{6,50}$/)
      .required(),
    photo: Joi.string()
  };

  const Validate = Joi.validate(req.body, schema);
  if (Validate.error) {
    return res.status(400).json(Validate.error.details[0].message);
  }
  // registerValidation(req.body, res);
  // lets find if user already exist. we have local model Schema nested in local { }. for nested search needs commas i.e "local.email"
  // check this youtube channel videos for more details on full auth with JWT 4 local, google and fb. https://www.youtube.com/watch?v=zx6jnaLuB9Q&list=PLSpJkDDmpFZ7GowbJE-mvX09zY9zfYatI
  User.findOne({ 'local.email': email }).then(user => {
    if (user) {
      // 400 status will tell axios that its error, if we changed status code to 200 axios will think all went well.
      return res.status(400).json('Email is in use for other account');
    }
    // check User in model, there is method implemented to seperate local/google/fb users, we add method:"local" with new user.
    if (password !== password2) {
      return res.status(400).json('confirm password do not match');
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

    // lets encrypt our password with bcrypt, always use newUser.local.xxxxx to reach nested user property in local.
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.local.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.local.password = hash;
        // Generate Verification Email Token to be saved in DB. will send this to user via Email.
        const secretToken = randomstring.generate();
        newUser.local.secretToken = secretToken;
        // Active Property False, till the user verify email.
        newUser.local.active = false;

        newUser
          .save()
          .then(user => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
              service: 'gmail',
              // secure: false, // true for 465, false for other ports
              auth: {
                user: GmailUser, // generated ethereal user
                pass: GmailPass, // generated ethereal password
                requireTLS: true
              },
              tls: {
                ciphers: 'SSLv3'
              }
            });

            let { name, email, secretToken } = user.local;
            // Send verification Email to Users email address.
            let mailOptions = {
              from: GmailUser, // sender address
              to: email, // list of receivers
              subject: 'Verify Your Account', // Subject line
              text: `Hello ${name}`, // plain text body
              html: `<br/>
                Thank you for registring ${name}!
                <br/><br/>
                Please click on the link below to verify your Account.
                <br/>
                <br/>
                <a href="https://localhost:3000/verifytoken/${secretToken}">click here to verify your Account</a>
                </br></br>
                `
            };

            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log(error);
              }
              console.log('Message sent: %s', info.messageId);
              // Preview only available when sending through an Ethereal account
              console.log(
                'Preview URL: %s',
                nodemailer.getTestMessageUrl(info)
              );
            });
            return res.json('Success');
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
  // loginValidation(req.body, res);
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z-0-9]{6,50}$/)
      .required()
  };

  const Validate = Joi.validate(req.body, schema);
  if (Validate.error) {
    return res.status(400).send(Validate.error.details[0].message);
  }

  // mongoose find for nested property will be defined like User.findOne({"local.email"}) to match email
  User.findOne({ 'local.email': email }).then(user => {
    if (!user) {
      return res.status(404).json('User not Found');
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
            photo: user.local.photo,
            secretToken: user.local.secretToken,
            active: user.local.active
          };
          // check if users Email is verified or not, if not return error to frontend. false property is === !
          if (!user.local.active) {
            return res
              .status(400)
              .json(`${email} is not verified, please check your mailbox.`);
          }

          jwt.sign(payload, secretOrKey, { expiresIn: '24h' }, (err, token) => {
            console.log({ token: 'Bearer ' + token });
            // have to use Object to get its value in localStorage in react, or it will be difficult ..
            // so token will be the object key and value will be the actual token with Bearer
            res.json({ token: 'Bearer ' + token });
          });
        } else {
          res.status(400).json('wrong password');
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
  passport.authenticate('google-plus-token', { session: false }),
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
        console.log('Bearer ' + token);
        res.json('Bearer ' + token);
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
        res.json('Bearer ' + token);
      }
    );
  }
);
// current_user Route
// @ Private Route
// check all the passport authentications at once, if user is local it will log it in via local, if google will go through google or facebook.
router.get(
  '/dashboard',
  // Mulitple passport.authentication methods.
  passport.authenticate(['jwt', 'google-plus-token', 'facebook-token'], {
    session: false
  }),
  // passport.authenticate('googleToken', { session: false }),
  (req, res) => {
    console.log('req.user', req.user);
    res.json(
      `Hello ${req.user.local.name ||
        req.user.google.name ||
        req.user.facebook.name}`
    );
  }
);

module.exports = router;
