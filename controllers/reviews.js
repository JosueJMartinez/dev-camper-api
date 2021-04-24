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
		const reviews = await Review.find({ bootcamp: bootcampId })
			.populate({
				path: 'bootcamp',
				select: 'name description',
			})
			.populate({
				path: 'user',
				select: 'name',
			});
		res.status(200).json({
			success: true,
			count: reviews.length,
			data: reviews,
		});
	} else {
		res.status(200).json(res.advancedResults);
	}
});

//  @desc     Get a single review
//  @route    Get /api/v1/reviews/reviewId
//  @access   Public
exports.getReview = asyncHandler(async (req, res, nexr) => {
	const { reviewId } = { ...req.params };
	const review = await Review.findById(reviewId)
		.populate({
			path: 'bootcamp',
			select: 'name description',
		})
		.populate({
			path: 'user',
			select: 'name',
		});

	if (!review)
		throw new ErrorResponse(
			`1. Resource not found with id of ${reviewId}`,
			404,
			reviewId
		);

	res.status(200).json({
		success: true,
		data: review,
	});
});

//  @desc     Add a review
//  @route    Post /api/v1/bootcamps/:bootcampId/reviews
//  @access   Private
exports.createReview = asyncHandler(async (req, res, next) => {
	const { bootcampId } = { ...req.params };
	const currentUser = req.user;

	const foundBootCamp = await Bootcamp.findById(bootcampId);
	const foundUserReview = await Review.findOne({
		user: currentUser.id,
		bootcamp: bootcampId,
	});

	// check for bootcamp exists before creating the review
	if (!foundBootCamp) {
		throw new ErrorResponse(
			`Resource not found with id of ${bootcampId}`,
			404,
			bootcampId
		);
	}

	// Check if user already made a review for this bootcamp
	if (foundUserReview) {
		throw new ErrorResponse(
			`Already made a review for this bootcamp`,
			401
		);
	}

	// Make sure user is owner of bootcamp to create course
	if (
		foundBootCamp.user.toString() !== currentUser.id &&
		currentUser.role !== 'admin'
	)
		throw new ErrorResponse(
			`User ${req.user.id} is not authorized to create course for bootcamp ${bootcampId}`,
			401
		);

	const newCourse = new Course({
		bootcamp: bootcampId,
		user: req.user.id,
		...req.body,
	});
	const addedCourse = await newCourse.save();

	res.status(201).json({
		success: true,
		data: addedCourse,
	});
});
