const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

//  @desc     Get all bootcamps
//  @route    Get /api/v1/bootcamps
//  @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	res.status(200).json(res.advancedResults);
});

//  @desc     Create a bootcamp
//  @route    Post /api/v1/bootcamps
//  @access   Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
	// check if this user has made any bootcamps
	// if they did check role admin can create more than one and publisher can only create one
	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });
	if (publishedBootcamp && req.user.role !== 'admin') {
		throw new ErrorResponse(
			`The user with id '${req.user.id}' and role '${req.user.role}' has either created a bootcamp or does not have permissions`,
			400
		);
	}

	// add user id to the new bootcamp,
	// which is provided from the middleware of protect in routes for bootcamps
	const newBootcamp = new Bootcamp({
		user: req.user.id,
		...req.body,
	});
	const addedBootcamp = await newBootcamp.save();
	res.status(201).json({
		success: true,
		data: addedBootcamp,
	});
});

//  @desc     Get one bootcamp
//  @route    Get /api/v1/bootcamps/:bootId
//  @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.findById(bootId).populate({
		path: 'courses',
		select: 'title',
	});
	if (!bootcamp)
		throw new ErrorResponse(
			`1. Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

//  @desc     Update Bootcamp
//  @route    Put /api/v1/bootcamps/:bootId
//  @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const updateBootcamp = req.body;
	const currentUser = req.user;
	// Find bootcamp to update
	let bootcamp = await Bootcamp.findById(bootId);

	if (!bootcamp)
		throw new ErrorResponse(
			`Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	// Make sure user is bootcamp owner or admin if return ErrorResponse
	if (
		bootcamp.user.toString() !== currentUser.id &&
		currentUser.role !== 'admin'
	)
		throw new ErrorResponse(
			`You do not have access to update campground with current role: ${currentUser.role}`,
			401
		);

	// update bootcamp if passes check
	bootcamp = await Bootcamp.findByIdAndUpdate(bootId, updateBootcamp, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: bootcamp,
	});
});

//  @desc     Delete bootcamp
//  @route    Delete /api/v1/bootcamps/:bootId
//  @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.findById(bootId);
	const currentUser = req.user;

	if (!bootcamp)
		throw new ErrorResponse(
			`Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	// Make sure user is bootcamp owner or admin if return ErrorResponse
	if (
		bootcamp.user.toString() !== currentUser.id &&
		currentUser.role !== 'admin'
	)
		throw new ErrorResponse(
			`You do not have access to delete campground with current role: ${currentUser.role}`,
			401
		);

	await bootcamp.deleteOne();

	res.status(200).json({
		success: true,
		data: {},
	});
});

//  @desc     Get bootcamps within radius
//  @route    GET /api/v1/bootcamps/radius/:zipcode/:distance/:unit
//  @access   Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance, unit } = { ...req.params };

	// get lat and long from geocoder
	const loc = await geocoder.geocode(zipcode);

	const { latitude, longitude } = { ...loc[0] };

	// calc radius using radians
	// divide distance by radius of earth depending on kilometers or miles
	// earth radius = 3,963 mi / 6,378 km
	const radius =
		unit.toLowerCase() === 'mi' ? distance / 3963 : distance / 6378;
	const bootcamps = await Bootcamp.find({
		location: {
			$geoWithin: { $centerSphere: [[longitude, latitude], radius] },
		},
	});

	res.status(200).json({
		success: true,
		data: bootcamps,
		count: bootcamps.length,
	});
});

//  @desc     Upload photo for bootcamp
//  @route    Put /api/v1/bootcamps/:bootId/uploadPhoto
//  @access   Private
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.findById(bootId);
	const currentUser = req.user;

	if (!bootcamp)
		throw new ErrorResponse(
			`Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	// Make sure user is bootcamp owner or admin if return ErrorResponse
	if (
		bootcamp.user.toString() !== currentUser.id &&
		currentUser.role !== 'admin'
	)
		throw new ErrorResponse(
			`You do not have access to upload photo for this campground`,
			401
		);

	if (!req.files || Object.keys(req.files).length === 0) {
		throw new ErrorResponse(`Please upload a file`, 400, bootId);
	}

	const bootcampPhoto = req.files.bootcampPhoto;

	// Check it is an actual photo uploads
	if (!bootcampPhoto.mimetype.startsWith('image')) {
		throw new ErrorResponse(`Wrong format for photo`, 400);
	}

	// Check filesize
	if (bootcampPhoto.size > process.env.MAX_PHOTO_UPLOAD_SIZE) {
		throw new ErrorResponse(
			`Please upload an image less than ${process.env.MAX_PHOTO_UPLOAD_SIZE} bytes`,
			400
		);
	}

	//Create custom file name
	bootcampPhoto.name = `photo_${bootId}${
		path.parse(bootcampPhoto.name).ext
	}`;

	bootcampPhoto.mv(
		`${process.env.FILE_UPLOAD_PATH}/${bootcampPhoto.name}`,
		async err => {
			if (err) {
				throw new ErrorResponse(`Error happen while saving photo`, 500);
			}

			await Bootcamp.findByIdAndUpdate(bootId, {
				photo: bootcampPhoto.name,
			});

			// Make sure user is bootcamp owner or admin if return ErrorResponse
			if (
				bootcamp.user.toString() !== currentUser.id &&
				currentUser.role !== 'admin'
			)
				throw new ErrorResponse(
					`You do not have access to delete campground with current role: ${currentUser.role}`,
					401
				);

			res.status(200).json({
				success: true,
				data: bootcampPhoto.name,
			});
		}
	);
});
