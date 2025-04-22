const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.get('/', (req, res) => {
    res.send('Hello World');
});

module.exports = router;