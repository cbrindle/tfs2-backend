const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: 'First name is required', trim: true },
    lastName: { type: String, required: 'Last name is required', trim: true },
    userName: { type: String, required: 'User name is required', trim: true },
    email: { type: String, required: 'Email address is required', unique: true, trim: true },
    password: { type: String, required: 'Password is required', trim: true },
    profilePic: { type: String, default: '' }
})

module.exports = mongoose.model('User', UserSchema);