const mongoose = require('mongoose');
const mongoFullStackAuth = require('../config/Keys').mongoFullStackAuth;
// Simple mongoose.com to only open single connection to DB.

mongoose
  .connect(
    mongoFullStackAuth,
    { useNewUrlParser: true }
  )
  .then(err => {
    console.log('mongoFullStackAuth is locally connected!');
  })
  .catch(err => {
    console.log('error:', err);
  });
