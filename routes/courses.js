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
const { protect, authorize } = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

router
	.route('/:courseId')
	.get(getCourse)
	.put(protect, authorize('publisher', 'protect'), updateCourse)
	.delete(protect, authorize('publisher', 'protect'), deleteCourse);
router
	.route('/')
	.get(
		advancedResults(
			Course,
			{ path: 'bootcamp', select: 'name description' },
			'Courses'
		),
		getCourses
	)
	.post(protect, authorize('publisher', 'protect'), createCourse);

module.exports = router;
