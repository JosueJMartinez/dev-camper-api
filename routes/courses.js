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
	.put(protect, authorize('publisher', 'admin'), updateCourse)
	.delete(protect, authorize('publisher', 'admin'), deleteCourse);
router
	.route('/')
	.get(
		advancedResults(Course, 'Courses', {
			path: 'bootcamp',
			select: 'name description',
		}),
		getCourses
	)
	.post(protect, authorize('publisher', 'admin'), createCourse);

module.exports = router;
