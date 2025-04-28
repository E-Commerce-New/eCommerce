const express = require('express');
const router = express.Router();
const {
    getUserByUsernameAndPassword,
    register,
    addToCart,
    getUser,
    updateUserProfile
} = require('../controllers/user.controllers');

router.post('/login', getUserByUsernameAndPassword);

router.post('/register', register)

router.post('/addToCart', addToCart);

router.post('/getUser', getUser);

router.put('/profileupdate', updateUserProfile)

module.exports = router