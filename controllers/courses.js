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
		query = Course.find({});
	}

	const courses = await query;
	if (!courses.length)
		throw new ErrorResponse('uh oh no more courses', 400);

	res.status(200).json({
		success: true,
		data: {
			courses,
			count: courses.length,
		},
	});
});
