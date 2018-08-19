const express = require('express');
const router = express.Router();
const Joi = require('joi');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const jwt = require('jsonwebtoken');

//Email nodemailer config
const nodemailer = require('nodemailer');
const emailUser = require('../../config/Keys').emailUser;
const emailPass = require('../../config/Keys').emailPass;

const User = require('../../model/User');
const secretOrKey = require('../../config/Keys').secretOrKey;
const registerValidation = require('./joi-validation/joi-register');
const loginValidation = require('./joi-validation/joi-login');

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
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      res.json({
        Email: `verification Email sent to ${req.user.local.email}`
      });
    });
  }
);

module.exports = router;
