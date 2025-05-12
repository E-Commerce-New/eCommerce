const express = require('express');
const router = express.Router();
const {
    getUserByUsernameAndPassword,
    register,
    getUserById,
    updateUserProfile,
    updateUserAddress
} = require('../controllers/user.controllers');

router.post('/login', getUserByUsernameAndPassword);

router.post('/register', register);

router.post('/getUser', getUserById);

router.put('/profileupdate', updateUserProfile);

router.put('/updateUserAddress' , updateUserAddress)

module.exports = router;