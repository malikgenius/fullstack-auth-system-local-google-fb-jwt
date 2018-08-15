const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
// Routes Imports
const users = require('./routes/api/users');

// mongodb load on startup
require('./mongodb/mongodb');

// MiddleWare
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('combined'));
app.use(passport.initialize());

//Passport Jwt Strategy, Google & Facebook
require('./passport/passport');

// CORS Allowed, if app sends request to thirdparty we need CORS or will get an error.
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Test Route
app.get('/', (req, res) => {
  res.json('YOU GOT ROOT');
});
// Routes
app.use('/api/users', users);

const port = process.env.PORT || 5000;
const Environment = process.env.NODE_ENV;
// console.log(Environment);
app.listen(port, err => {
  if (err) {
    return console.log(`Error: ${err}`);
  }
  console.log(`FullStack Auth System JWT is listening on ${port}`);
});
