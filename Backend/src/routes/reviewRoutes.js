const express = require('express');
const router = express.Router();
const { addReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, addReview);

router.route('/:productId')
  .get(getReviews);

module.exports = router;
