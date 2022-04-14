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
            if (req.body.email === 'admin' && req.body.password === process.env.ADMIN_PASS) {
                const adminData = { name: 'Admin', email: 'none', id: 'XXX' }
                const adminToken = await authHelper.createUserToken(adminData);
                const adminObj = { token: adminToken, userName: 'Admin', email: 'none' }
                res.json(adminObj)
            }
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
        try {
            const foundUser = await User.findById(req.params.userID);
            res.json(foundUser);
        } catch (err) {
            console.log(err);
            res.status(500).json(err)
        }
    },

    updateProfile: async (req, res) => {
        try {
            const foundUser = await User.findOne({ email: req.body.email });
            if ((!foundUser)) {
                throw 'User not found'
            }
            if (req.body.newUserName !== '') {
                foundUser.userName = req.body.newUserName;
            }
            if (req.body.newFirstName !== '') {
                foundUser.firstName = req.body.newFirstName;
            }
            if (req.body.newLastName !== '') {
                foundUser.lastName = req.body.newLastName;
            }
            if (req.body.newEmail !== '' && req.body.newEmail.includes('@')) {
                foundUser.email = req.body.newEmail;
            }
            if (req.body.newPassword !== '') {
                foundUser.password = req.body.newPassword;
            }
            await foundUser.save();
            const returnUser = {
                firstName: foundUser.firstName,
                lastName: foundUser.lastName,
                userName: foundUser.userName,
                email: foundUser.email
            }
            res.json(returnUser)
        } catch (err) {
            res.status(500).json(err)
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const allUsers = await User.find();
            res.json(allUsers);
        } catch (err) {
            console.log(err);
            return err
        }
    }
}