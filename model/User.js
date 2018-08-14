const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    require: true
  },
  local: {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    password: {
      type: String
    },
    photo: {
      type: String
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    photo: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    photo: {
      type: String
    }
  }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
