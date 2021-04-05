const express = require('express');
const {
	getCourses,
	getCourse,
	createCourse,
} = require('../controllers/courses');

const router = express.Router({ mergeParams: true });

router.route('/:courseId').get(getCourse);
router.route('/').get(getCourses).post(createCourse);

module.exports = router;
