const express = require('express');
const router = express.Router();
const {increaseCartQuantity, removeFromCart, decreaseCartQuantity, addToCart} = require('../controllers/cart.controller');


router.post('/addToCart', addToCart)
router.put('/increase', increaseCartQuantity)
router.put('/decrease', decreaseCartQuantity)
router.delete('/delete', removeFromCart)


module.exports = router;