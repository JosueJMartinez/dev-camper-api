const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

//  @desc     Get all bootcamps
//  @route    Get /api/v1/bootcamps
//  @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	// 	Copy req.query
	const reqQuery = { ...req.query };

	// 	Fields to exclude
	const removeFields = ['select', 'sort', 'page', 'limit'];

	// 	Loop over removeFields and delete them from the reqQuery
	removeFields.forEach(param => delete reqQuery[param]);

	// 	Create query string`
	let queryStr = JSON.stringify(reqQuery);

	// 	Create operators ($gt, $gte, etc)
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		match => `$${match}`
	);

	// 	Find resources
	let query = Bootcamp.find(JSON.parse(queryStr)).populate({
		path: 'courses',
		select: 'title',
	});

	// Select fields do this only if select fields are present to limit selection
	if (req.query.select) {
		const fields = req.query.select.replace(/,/g, ' ');
		query.select(fields);
	}

	// Sort
	if (req.query.sort) {
		const sortBy = req.query.sort.replace(/,/g, ' ');
		query.sort(sortBy);
	} else {
		query.sort('-createAt');
	}

	// Pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 25;
	const startIdx = limit * (page - 1);
	const endIdx = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIdx).limit(limit);

	// 	Executing Query
	const bootcamps = await query;

	// Pagination result
	const pagination = {};
	if (endIdx < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIdx > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	if (!bootcamps.length)
		throw new ErrorResponse(`uh oh no more bootcamps`, 400);

	res.status(200).json({
		success: true,
		data: {
			bootcamps,
			count: bootcamps.length,
		},
		pagination,
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
//  @route    Get /api/v1/bootcamps/:bootId
//  @access   Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.findById(bootId).populate({
		path: 'courses',
		select: 'title',
	});
	console.log(bootcamp);
	if (!bootcamp)
		throw new ErrorResponse(
			`1. Resource not found with id of ${bootId}`,
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

//  @desc     Update Bootcamp
//  @route    Put /api/v1/bootcamps/:bootId
//  @access   Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const updateBootcamp = req.body;
	const bootcamp = await Bootcamp.findByIdAndUpdate(
		bootId,
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
//  @route    Delete /api/v1/bootcamps/:bootId
//  @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.findById(bootId);
	if (!bootcamp)
		throw new ErrorResponse(
			`Resource not found with id of ${bootId}`,
			404,
			bootId
		);

	bootcamp.remove();

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
