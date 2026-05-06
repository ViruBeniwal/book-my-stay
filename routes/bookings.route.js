const express = require('express');


const {bookings, bookProperty, deleteBooking} = require("../controllers/bookings.controller");      
const userAuthenticator = require('../middleware/users.middleware.js');
const roleAuthenticator = require('../middleware/roles.middleware.js');

const router = express.Router();

// get all booking for a user
router.get('/', userAuthenticator, bookings);

// book a property
router.post('/:id', userAuthenticator, bookProperty);

// delete a booking
router.delete('/:id', userAuthenticator, deleteBooking);


module.exports = router;