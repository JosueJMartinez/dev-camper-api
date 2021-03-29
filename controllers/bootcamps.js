const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//  @desc     Get all bootcamps
//  @route    Get /api/v1/bootcamps
//  @access   Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find({});
	console.log(`bootcamps: ${bootcamps}`);
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
	const bootcamp = await Bootcamp.findById(bootId);

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
//  @route    Put /api/v1/bootcamps/:id
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
//  @route    Delete /api/v1/bootcamps/:id
//  @access   Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const { bootId } = { ...req.params };
	const bootcamp = await Bootcamp.findByIdAndDelete(bootId);
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
