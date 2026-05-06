const express = require('express');
const userAuthenticator = require('../middleware/users.middleware.js');
const roleAuthenticator = require('../middleware/roles.middleware.js');
//const Property = require('../models/properties.model.js');

const { getProperties, 
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty } = require('../controllers/properties.controller.js');


const router = express.Router();

// get all properties
router.get('/', userAuthenticator, getProperties);

// get a property by id
router.get('/:id', userAuthenticator, getProperty);

// create a property (only host can create a property)
router.post('/', userAuthenticator, roleAuthenticator, createProperty);

// update a property (only host can update a property)
router.patch('/:id', userAuthenticator, roleAuthenticator, updateProperty);

// delete a property (only host can delete a property)
router.delete('/:id', userAuthenticator, roleAuthenticator, deleteProperty);

module.exports = router;