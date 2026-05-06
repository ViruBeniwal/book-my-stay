const userAuthenticator = require('../middleware/users.middleware.js')
const { getMe, updateMe, deleteMe } = require('../controllers/profile.controller.js');

const express = require('express');

const router = express.Router();

// to get the profile of user
router.get('/me', userAuthenticator, getMe);

// to update the profile 
router.patch('/me', userAuthenticator, updateMe);

// to delete the profile
router.delete('/me', userAuthenticator, deleteMe);


module.exports = router;