const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {getUserByUsernameAndPassword , register, addToCart} = require('../controllers/user.controllers');

// Login or Registration route
router.post('/login', getUserByUsernameAndPassword);

router.post('/register', register)

router.post('/addToCart', addToCart);

module.exports = router