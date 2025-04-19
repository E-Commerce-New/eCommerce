const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {getUserByUsernameAndPassword} = require('../controllers/user.controllers');

// Login or Registration route
router.post('/login', getUserByUsernameAndPassword);


module.exports = router