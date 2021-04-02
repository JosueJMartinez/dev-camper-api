const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
//  @desc     Get all bootcamps
//  @route    Get /api/v1/bootcamps
//  @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let queryStr = JSON.stringify(req.query);
	
	queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
	
	const query = JSON.parse(queryStr)
	
	const bootcamps = await Bootcamp.find(query);
	res.status(200).json({
		success: true,
		data: {
			bootcamps,
			count: bootcamps.length,
		},
	});
});

//  @desc     Create a bootcamp
//  @route    Post /api/v1/bootcamps
//  @access   Private
exports.createBootCamp = asyncHandler(async (req, res, next) => {
	const newBootcamp = new Bootcamp(req.body);
	const addedBootcamp = await newBootcamp.save();
	res.status(201).json({
		success: true,
		data: addedBootcamp,
	});
});

//  @desc     Get one bootcamp
//  @route    Get /api/v1/bootcamps/:id
//  @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.find({ slug: bootId });
	console.log(bootcamp);
	if (!bootcamp.length)
		throw new ErrorResponse(
			`1. Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	res.status(200).json({
		success: true,
		data: {
			bootcamp: bootcamp[0],
		},
	});
});

//  @desc     Update Bootcamp
//  @route    Put /api/v1/bootcamps/:id
//  @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const updateBootcamp = req.body;
	const bootcamp = await Bootcamp.findOneAndUpdate(
		{ slug: bootId },
		updateBootcamp,
		{
			new: true,
			runValidators: true,
		}
	);
	if (!bootcamp)
		throw new ErrorResponse(
			`Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	res.status(200).json({
		success: true,
		data: {
			bootcamp,
		},
	});
});

//  @desc     Delete bootcamp
//  @route    Delete /api/v1/bootcamps/:id
//  @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.findOneAndDelete({ slug: bootId });
	if (!bootcamp)
		throw new ErrorResponse(
			`Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	res.status(200).json({
		success: true,
		data: {
			bootcamp,
		},
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
		data: {
			bootcamps,
			count: bootcamps.length,
		},
	});
});
