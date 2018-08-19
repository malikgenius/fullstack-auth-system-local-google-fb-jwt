const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  local: {
    //cant say its required, as if user logins with Google or fb, it will though error.
    name: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String
    },
    photo: {
      type: String
    },
    secretToken: {
      type: String
    },
    active: {
      type: Boolean
    }
  },
  google: {
    id: {
      type: String
    },
    name: {
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
    name: {
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
