const express = require('express');
const {
	getReviews,
	getReview,
	createReview,
	updateReview,
	deleteReview,
} = require('../controllers/reviews');
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router
	.route('/:reviewId')
	.get(getReview)
	.put(protect, authorize('user', 'admin'), updateReview)
	.delete(protect, authorize('user', 'admin'), deleteReview);

router
	.route('/')
	.get(
		advancedResults(Review, 'Reviews', {
			path: 'user',
			select: 'name',
		}),
		getReviews
	)
	.post(protect, authorize('user', 'admin'), createReview);

module.exports = router;
