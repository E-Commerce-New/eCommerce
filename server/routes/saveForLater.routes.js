const express = require('express');
const router = express.Router();
const { saveForLater , getSaveForLaterItems , deleteFromSaveForLater , moveToCart } = require("../controllers/saveForLater.controller");

router.post('/saveForLater', saveForLater);
router.get('/get/:userId', getSaveForLaterItems);
router.post("/move-to-cart", moveToCart);
router.post("/delete-save-for-later", deleteFromSaveForLater);

module.exports = router;