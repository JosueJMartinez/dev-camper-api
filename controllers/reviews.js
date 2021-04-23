const path = require('path');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//  @desc     Get all reviews
//  @route    Get /api/v1/reviews
//  @route    Get /api/v1/bootcamps/:bootId/reviews
//  @access   Public
exports.getReviews = asyncHandler(async (req, res, next) => {
	// let query;
	const { bootcampId } = { ...req.params };
	if (bootcampId) {
		const reviews = await Review.find({ bootcamp: bootcampId });
		res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});
