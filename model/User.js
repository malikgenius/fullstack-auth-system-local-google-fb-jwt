const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  method: {}
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
