const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  phoneNumber: {
    type: Number,
    validate: {
      validator: (v) => {
        return /\d{10}/.test(v);
      },
      message: '{VALUE} is not a valid 10 digit number!',
    },
  },
  role: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('User', UserSchema);
