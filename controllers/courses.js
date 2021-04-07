const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

//  @desc     Get all courses
//  @route    Get /api/v1/courses
//  @route    Get /api/v1/bootcamps/:bootId/courses
//  @access   Public
exports.getCourses = asyncHandler(async (req, res, next) => {
	let query;
	const { bootcampId } = { ...req.params };
	if (bootcampId) {
		// let bootCampQuery = await Bootcamp.find({ slug: bootId }).select(
		// 	'_id'
		// );
		// console.log(bootCampQuery);
		query = Course.find({ bootcamp: bootcampId });
	} else {
		query = Course.find({}).populate({
			path: 'bootcamp',
			select: 'name description',
		});
	}

	const courses = await query;
	if (!courses.length)
		throw new ErrorResponse(
			'uh oh no more courses',
			400,
			bootcampId || null
		);

	res.status(200).json({
		success: true,
		data: {
			courses,
			count: courses.length,
		},
	});
});

//  @desc     Get one course
//  @route    Get /api/v1/courses/:courseId
//  @access   Public
exports.getCourse = asyncHandler(async (req, res, next) => {
	const { courseId } = { ...req.params };
	const course = await Course.findById(courseId).populate({
		path: 'bootcamp',
		select: 'name description',
	});

	if (!course)
		throw new ErrorResponse(
			`1. Resource not found with id of ${courseId}`,
			404,
			courseId
		);

	res.status(200).json({
		success: true,
		data: {
			course,
		},
	});
});

//  @desc     Add a single Course
//  @route    Post /api/v1/bootcamps/:bootcampId/courses
//  @access   Private
exports.createCourse = asyncHandler(async (req, res, next) => {
	const { bootcampId } = { ...req.params };
	const foundBootCamp = await Bootcamp.findById(bootcampId);
	if (!foundBootCamp) {
		throw new ErrorResponse(
			`Resource not found with id of ${bootcampId}`,
			404,
			bootcampId
		);
	}
	const newCourse = new Course({ bootcamp: bootcampId, ...req.body });
	const addedCourse = await newCourse.save();

	res.status(201).json({
		success: true,
		data: {
			addedCourse,
		},
	});
});

//  @desc     Update Course
//  @route    Put /api/v1/courses/:courseId
//  @access   Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
	const { courseId } = { ...req.params };

	const updateCourse = req.body;
	const course = await Course.findByIdAndUpdate(courseId, updateCourse, {
		new: true,
		runValidators: true,
	});

	if (!course)
		throw new ErrorResponse(
			`Resource not found with id of ${courseId}`,
			404,
			courseId
		);

	res.status(200).json({
		success: true,
		data: {
			course,
		},
	});
});

//  @desc     Delete course
//  @route    Delete /api/v1/courses/:courseId
//  @access   Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
	const { courseId } = { ...req.params };
	const course = await Course.findById(courseId);
	if (!course)
		throw new ErrorResponse(
			`Resource not found with id of ${courseId}`,
			404,
			courseId
		);

	course.remove();

	res.status(200).json({
		success: true,
		data: {
			course,
		},
	});
});
