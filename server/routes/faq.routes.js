const express = require('express');
const router = express.Router();

const {getAllFaqs, createFaq , deleteFaq} = require('../controllers/faq.controller');

router.get('/', getAllFaqs);
router.post('/create', createFaq);
router.delete("/delete/:id", deleteFaq);



module.exports = router;