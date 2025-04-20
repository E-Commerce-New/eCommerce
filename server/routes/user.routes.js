const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {getUserByUsernameAndPassword , register} = require('../controllers/user.controllers');

// Login or Registration route
router.post('/login', getUserByUsernameAndPassword);
router.post('/register', register);


module.exports = router