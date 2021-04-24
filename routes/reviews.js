const express = require('express');
const { getReviews, getReview } = require('../controllers/reviews');
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require('../middleware/auth');

router.route('/:reviewId').get(getReview);
// 	.put(protect, authorize('publisher', 'admin'), updateCourse)
// 	.delete(protect, authorize('publisher', 'admin'), deleteCourse);
router.route('/').get(
	advancedResults(Review, 'Reviews', {
		path: 'user',
		select: 'name',
	}),
	getReviews
);
// .post(protect, authorize('publisher', 'admin'), createCourse);

module.exports = router;
