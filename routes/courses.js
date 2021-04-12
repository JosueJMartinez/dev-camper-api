const express = require('express');
const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');
const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
	.route('/:courseId')
	.get(getCourse)
	.put(updateCourse)
	.delete(deleteCourse);
router
	.route('/')
	.get(
		advancedResults(
			Course,
			{ path: 'bootcamp', select: 'name' },
			'Courses'
		),
		getCourses
	)
	.post(createCourse);

module.exports = router;
