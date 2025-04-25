const express = require('express');
const router = express.Router();
const User = require('../models/user');
const {getUserByUsernameAndPassword , register, addToCart , getUser, updateUserProfile} = require('../controllers/user.controllers');
const axios = require('axios');

// Login or Registration route
router.post('/login', getUserByUsernameAndPassword);

router.post('/register', register)

router.post('/addToCart', addToCart);

router.post('/getUser', getUser);

router.put('/profileupdate', updateUserProfile)

// router.post('/shipping' , async (req, res) => {
//     try {
//         const { email, password } = req.body;
//
//         const response = await axios.post("https://apiv2.shiprocket.in/v1/external/auth/login", {
//             email,
//             password
//         });
//
//         res.status(200).json(response.data);
//     } catch (error) {
//         console.error("Shiprocket Error:", error.response?.data || error.message);
//         res.status(500).json({
//             message: "Shiprocket login failed",
//             error: error.response?.data || error.message
//         });
//     }
// })

module.exports = router