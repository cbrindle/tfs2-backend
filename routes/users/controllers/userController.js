const User = require('../models/User');
const bcrypt = require('bcryptjs');
const authHelper = require('../../lib/helpers/authHelper');

module.exports = {

    signUp: async (req, res) => {
        try {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userName: req.body.userName,
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
                console.log(`User not found`);
                throw 'Invalid Email / Password'
            }

            const comparePassword = await authHelper.comparePassword(req.body.password, foundUser.password);
            if (comparePassword === 409) {
                console.log(`Password incorrect`);
                throw 'Invalid Email / Password'
            }

            const jwtToken = await authHelper.createUserToken(foundUser);
            const successObj = {
                token: jwtToken,
                userName: foundUser.userName,
                email: foundUser.email
            }
            res.json(successObj)

        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },

    getProfile: async (req, res) => {
        console.log(req.params.userID);
        try {
            const foundUser = await User.findById(req.params.userID);
            res.json(foundUser);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    }
}