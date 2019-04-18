const mongoose = require('mongoose')

const userSchema = mongoose.Schema;

const userData = new userSchema({
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
        type: Array,
        required: true
    },
    role: {
        type: Number,
        required: true
    }
})


exports.Users = mongoose.model('Users', userData);