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
const emailUser = require('../../config/Keys').emailUser;
const emailPass = require('../../config/Keys').emailPass;

const User = require('../../model/User');
const secretOrKey = require('../../config/Keys').secretOrKey;
const registerValidation = require('./joi-validation/joi-register');
const loginValidation = require('./joi-validation/joi-login');

// Register Route
// @ Public Route
router.post('/register', (req, res) => {
  const { name, email, password, photo } = req.body;
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
      return res.status(400).json('Email is already Used for other Account ');
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
              host: 'smtp.office365.com',
              port: 587,
              // secure: false, // true for 465, false for other ports
              auth: {
                user: emailUser, // generated ethereal user
                pass: emailPass, // generated ethereal password
                requireTLS: true
              },
              tls: {
                ciphers: 'SSLv3'
              }
            });

            const { name, email, secretToken } = user.local;
            // Send verification Email to Users email address.
            let mailOptions = {
              from: '"ZEELIST" <pooja@zeenah.com>', // sender address
              to: email, // list of receivers
              subject: 'Verify Your Account', // Subject line
              text: `Hello ${name}`, // plain text body
              html: `<br/>
                Thank you for registring ${name}!
                <br/><br/>
                Please verify your email,  copy following access token:
                <br/>
                Token: <b>${secretToken}</b>
                <br/>
                now click on the link below and paste this access token in verification page where asked. 
                <a href="https://localhost:3000/verifytoken">click here to open verification link</a>
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
              .json(
                `unverified email, go to https://localhost:3000/verifytoken to verify your token</a>`
              );
          }

          jwt.sign(payload, secretOrKey, { expiresIn: '24h' }, (err, token) => {
            console.log({ token: 'Bearer ' + token });
            return res.json('Bearer ' + token);
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

// Verify Local Users with secretToken
router.post('/verifytoken', (req, res) => {
  const verifyToken = req.body.token;
  User.findOne({ 'local.secretToken': verifyToken.trim() }).then(user => {
    if (!user) {
      return res
        .status(400)
        .json('Invalid or Expired verification Token code.');
      // return res.redirect('https://localhost:3000');
    }
    user.local.active = true;
    user.local.secretToken = '';
    user.save().then(
      // res.redirect('https://localhost:3000')
      res.json('Thank you for verifying your email, you may Login now')
    );
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
  '/current_user',
  // Mulitple passport.authentication methods.
  passport.authenticate(['jwt', 'google-plus-token', 'facebook-token'], {
    session: false
  }),
  // passport.authenticate('googleToken', { session: false }),
  (req, res) => {
    console.log('req.user', req.user);
    res.json('Top Secret Docs only for Authenticated Users.');
  }
);

module.exports = router;
