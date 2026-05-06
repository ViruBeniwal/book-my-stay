const express = require('express');

const router = express.Router();

const {
    signupUser,
    loginUser,
    refreshAccessToken,
    logout
} = require('../controllers/auth.controller.js');

const userAuthenticator = require('../middleware/users.middleware.js');

// signup a user
router.post('/signup', signupUser);

// login a user
router.post('/login', loginUser);

//refresh access token
router.get('/refresh-token', refreshAccessToken);

// logut 
router.delete('/logout',userAuthenticator, logout);

module.exports = router;