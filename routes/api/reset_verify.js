const express = require('express');
const router = express.Router();
const Joi = require('joi');
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

// Verify Local Users with secretToken
router.post('/verifytoken/:token', (req, res) => {
  const verifyToken = req.params.token;
  User.findOne({ 'local.secretToken': verifyToken }).then(user => {
    if (!user) {
      return res.status(400).json('Invalid verification Token code.');
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

// Reset Password Send Token and redirect user to reset password page.

router.post('/forgot', (req, res) => {
  const email = req.body.email;
  User.findOne({ 'local.email': email }).then(user => {
    if (!user) {
      return res.status(400).json('Email is not regirsted');
    }
    // return console.log(user);
    // generate reset password token
    const resetToken = randomstring.generate();
    user.local.resetPasswordToken = resetToken;
    // mongodb will save Date in human readable format, to compare this with Date.now we need to use mongodb only not the pure JS.
    // check resetpassword route for details.
    user.local.resetPasswordExpires = Date.now() + 3600000; // 1 hour time to expire the token.
    user
      .save()
      .then(user => {
        // return console.log(user);
        // res.status(200).json('Reset Email sent successfully');
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

        let { name, email, resetPasswordToken } = user.local;
        // Send verification Email to Users email address.
        let mailOptions = {
          from: GmailUser, // sender address
          to: user.local.email, // list of receivers
          subject: 'reset Your Password', // Subject line
          // text: `Hello ${name}`, // plain text body
          html: `<br/>
          Hi, ${name}!
          <br/><br/>
          You have asked to reset your password,  copy following reset token:
          <br/>
          
          <br/>
          now click on the link below to reset your password.
          <a href="https://localhost:3000/changepassword/${resetPasswordToken}">click here to reset Your Password</a>
          </br></br>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
        return res.json('Please check your email for reset link');
      })
      .catch(err => {
        console.log('Error in nodemailer', err);
      });
  });
});

//Change Password ... check Axios how to get params into Actions via history method.
router.post('/changepassword/:token', (req, res) => {
  const resetToken = req.params.token;
  console.log(resetToken);
  User.findOne({
    'local.resetPasswordToken': resetToken,
    'local.resetPasswordExpires': { $gt: Date.now() }
  }).then(user => {
    if (!user) {
      return res.status(404).json('Invalid or Expired Token');
    }
    console.log(user.local.resetPasswordExpires);
    console.log(Date.now());
    if (user.local.resetPasswordExpires > Date.now) {
      return res.status(400).json('reset token expired');
    }
    return res.json(req.params.resetToken);
  });

  // res.status(200).json('Got your Passoword');
});

// Verification Email  Route
// @ Public Route
router.get(
  '/verifyemailresend',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.user);
    // Verificaiton Email sending Process ..
    if (req.user.local.active) {
      return res.status(404).json({ verified: 'user is already verified' });
    }
    const { name, email, secretToken } = req.user.local;
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

    // Send verification Email to Users email address.
    let mailOptions = {
      from: GmailUser, // sender address
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
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.json({
        Email: `verification Email sent to ${req.user.local.email}`
      });
    });
  }
);

module.exports = router;
