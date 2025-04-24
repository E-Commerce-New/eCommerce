const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const {placeOrder} = require('../controllers/order.controller');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/place', placeOrder)

module.exports = router;