const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const {placeOrder , getOrdersById , getOrders, getTotalRevenue, cancelOrderByOrderId, getDeliveryCharges , checkIfPurchased} = require('../controllers/order.controller');

router.get('/', (req, res) => {
    res.send('Hello World');
});

router.post('/place', placeOrder)
router.post('/getOrdersById', getOrdersById)
router.get('/getOrders' , getOrders )
router.get('/revenue' , getTotalRevenue )
router.post('/cancelOrder', cancelOrderByOrderId)
router.get('/getCharges/:topincode/:weight', getDeliveryCharges)
router.get('/checkIfPurchased' , checkIfPurchased)

module.exports = router;