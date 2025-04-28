const express = require('express');
const {ForgotPassword , ResetPassword} = require('../controllers/forgotPassword.controller');


const router = express.Router();

router.post('/forgot-password', ForgotPassword);

router.post('/reset-password/:token', ResetPassword);

module.exports = router;
