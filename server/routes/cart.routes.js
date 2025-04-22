const express = require('express');
const router = express.Router();
const { increaseCartQuantity, removeFromCart , decreaseCartQuantity} = require('../controllers/cart.controller');

router.put('/increase' , increaseCartQuantity )
router.put('/decrease' ,  decreaseCartQuantity)
router.delete('/delete' , removeFromCart  )



module.exports = router;