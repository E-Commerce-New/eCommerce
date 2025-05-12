const router = require('express').Router();
const {createReview , getReviewsByProduct} = require('../controllers/review.Controller');

router.post('/createReview', createReview)
router.get('/getReviewsByProduct/:id', getReviewsByProduct)

module.exports = router;