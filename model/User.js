const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
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

// Hashing Password ...

UserSchema.pre('save', function userSchemaPre(next) {
  const user = this;
  if (user.method === 'local') {
    if (this.isModified('local.password') || this.isNew) {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return next(err);
        }
        bcrypt.hash(user.local.password, salt, (hashErr, hash) => {
          if (hashErr) {
            return next(hashErr);
          }
          user.local.password = hash;
          next();
        });
      });
    } else {
      return next();
    }
  } else {
    next();
  }
});

const User = mongoose.model('users', UserSchema);

module.exports = User;
