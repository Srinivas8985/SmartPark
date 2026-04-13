const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// @route   POST /api/reviews/slot/:slotId
// @desc    Add a review for a slot
// @access  Private
router.post('/slot/:slotId', auth, reviewController.addReview);

// @route   GET /api/reviews/slot/:slotId
// @desc    Get all reviews for a slot
// @access  Public
router.get('/slot/:slotId', reviewController.getSlotReviews);

module.exports = router;
