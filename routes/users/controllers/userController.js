const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authHelper = require('../../lib/helpers/authHelper');

module.exports = {

    signUp: async (req, res) => {
        try {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            })

            const salt = await bcrypt.genSalt(10);

            const hashedPassword = await bcrypt.hash(newUser.password, salt);

            newUser.password = hashedPassword;
            await newUser.save();

            res.json({
                message: 'success',
                newUser: newUser
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'error',
            })
        }
    },

    login: async (req, res) => {
        try {
            const foundUser = await User.findOne({ email: req.body.email });
            if (foundUser === null) {
                throw 'Invalid Email / Password'
            }

            const comparePassword = await authHelper.comparePassword(req.body.password, foundUser.password);
            if (comparePassword === 409) {
                throw 'Invalid Email / Password'
            }

            const jwtToken = await authHelper.createUserToken(foundUser);
            res.status(200).json({
                message: 'success',
                token: jwtToken
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'error'
            })
        }
    }
}