const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: 'Name is required', trim: true },
    email: { type: String, required: 'Email address is required', trim: true },
    password: { type: String, required: 'Password is required', trim: true },
    profilePic: { type: String, default: '' }
})

module.exports = mongoose.model('User', UserSchema);