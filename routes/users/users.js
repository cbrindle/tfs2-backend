const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

router.post('/signup', userController.signUp);


router.post('/login', userController.login);


router.get('/get-profile/:userID', userController.getProfile);


router.post('/update-profile', userController.updateProfile);


router.get('/get-all-users', userController.getAllUsers);

module.exports = router;