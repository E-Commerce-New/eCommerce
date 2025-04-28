const express = require('express');
const router = express.Router();
const { createBanner , getBanner , deleteBanner , addMainProduct } = require('../controllers/uiCustomize.controller');

router.post('/create', createBanner);

router.get('/get', getBanner);

router.delete('/deleteBanner/:index', deleteBanner);

router.post('/addMainProducts', addMainProduct);

module.exports = router;
