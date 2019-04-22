const mongoose = require('mongoose')

const UserSchema = mongoose.Schema

const userData = new UserSchema({
  name: {
    type: String,
    required: true
  },
  emailId: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  phone: {
    type: Number,
    required: true
  },
  location: {
    type: { type: String, required: true },
    coordinates: []
  },
  role: {
    type: Number,
    required: true
  }
})

exports.Users = mongoose.model('Users', userData)
