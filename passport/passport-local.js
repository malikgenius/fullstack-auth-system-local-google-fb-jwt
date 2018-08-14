const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const secretOrKey = require('../config/Keys').secretOrKey;
const User = require('../model/User');

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = secretOrKey;

passport.use(
  new JwtStrategy(options, (jwt_payload, done) => {
    console.log(jwt_payload);
  })
);
