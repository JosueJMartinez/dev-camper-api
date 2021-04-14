const express = require('express');
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	createBootCamp,
	deleteBootcamp,
	getBootcampsInRadius,
	uploadBootcampPhoto,
} = require('../controllers/bootcamps');
const { getCourses } = require('../controllers/courses');
const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// Includes other resource routers
const courseRouter = require('./courses');
const router = express.Router();

// This is how to reroute into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadius);
router
	.route('/:bootId/uploadPhoto')
	.put(protect, authorize('publisher', 'protect'), uploadBootcampPhoto);
router
	.route('/:bootId')
	.get(getBootcamp)
	.put(protect, authorize('publisher', 'protect'), updateBootcamp)
	.delete(protect, authorize('publisher', 'protect'), deleteBootcamp);

router
	.route('/')
	.get(
		advancedResults(
			Bootcamp,
			{ path: 'courses', select: 'title' },
			'Bootcamps'
		),
		getBootcamps
	)
	.post(protect, authorize('publisher', 'protect'), createBootCamp);

module.exports = router;
