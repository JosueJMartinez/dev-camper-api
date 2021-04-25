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
			`Could not find bootcamp to write review`,
			404,
			bootcampId
		);
	}

	const newReview = new Review({
		...req.body,
		bootcamp: bootcampId,
		user: currentUser.id,
	});
	const addedReview = await newReview.save();

	res.status(201).json({
		success: true,
		data: addedReview,
	});
});

//  @desc     Update review
//  @route    Put /api/v1/reviews/:reviewId
//  @access   Private
exports.updateReview = asyncHandler(async (req, res, next) => {
	const { reviewId } = { ...req.params };
	const currentUser = req.user;
	const updateReview = req.body;
	let review = await Review.findById(reviewId);
	if (!review)
		throw new ErrorResponse(
			`Resource not found with id of ${reviewId}`,
			404,
			reviewId
		);

	// Make sure user is review owner or admin if return ErrorResponse
	if (
		review.user.toString() !== currentUser.id &&
		currentUser.role !== 'admin'
	)
		throw new ErrorResponse(
			`User ${req.user.id} is not authorized to update review ${reviewId}`,
			401
		);

	review = await Review.findByIdAndUpdate(reviewId, updateReview, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: review,
	});
});

//  @desc     Delete review
//  @route    Delete /api/v1/reviews/:reviewId
//  @access   Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
	const { reviewId } = { ...req.params };
	const review = await Review.findById(reviewId);
	const currentUser = req.user;

	if (!review)
		throw new ErrorResponse(
			`Resource not found with id of ${reviewId}`,
			404,
			reviewId
		);

	// Make sure user is review owner or admin if return ErrorResponse
	if (
		review.user.toString() !== currentUser.id &&
		currentUser.role !== 'admin'
	)
		throw new ErrorResponse(
			`User ${req.user.id} is not authorized to update review ${reviewId}`,
			401
		);

	await review.remove();

	res.status(200).json({
		success: true,
		data: {},
	});
});
