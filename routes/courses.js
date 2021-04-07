const express = require('express');
const {
	getCourses,
	getCourse,
	createCourse,
	updateCourse,
	deleteCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router
	.route('/:courseId')
	.get(getCourse)
	.put(updateCourse)
	.delete(deleteCourse);
router.route('/').get(getCourses).post(createCourse);

module.exports = router;
