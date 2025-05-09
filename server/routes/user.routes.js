const express = require('express');
const router = express.Router();
const {
    getUserByUsernameAndPassword,
    register,
    getUserById,
    updateUserProfile
} = require('../controllers/user.controllers');

router.post('/login', getUserByUsernameAndPassword);

router.post('/register', register);

router.post('/getUser', getUserById);

router.put('/profileupdate', updateUserProfile);

module.exports = router;