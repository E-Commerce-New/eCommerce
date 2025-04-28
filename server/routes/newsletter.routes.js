const express = require('express');
const router = express.Router();
const {subscribeNewsletter, getAllSubscribers} = require('../controllers/Newsletter');

router.post('/subscribe', subscribeNewsletter);
router.get('/subscribers', getAllSubscribers);

module.exports = router;
