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
const { protect, authorize } = require('../middleware/auth');

const advancedResults = require('../middleware/advancedResults');
const Bootcamp = require('../models/Bootcamp');

// Includes other resource routers
const courseRouter = require('./courses');
const reviewRouter = require('./reviews');
const router = express.Router();

// This is how to reroute into other resource routers
router.use('/:bootcampId/courses', courseRouter);
router.use('/:bootcampId/reviews', reviewRouter);

router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadius);
router
	.route('/:bootId/uploadPhoto')
	.put(protect, authorize('publisher', 'admin'), uploadBootcampPhoto);
router
	.route('/:bootId')
	.get(getBootcamp)
	.put(protect, authorize('publisher', 'admin'), updateBootcamp)
	.delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

router
	.route('/')
	.get(
		advancedResults(Bootcamp, 'Bootcamps', {
			path: 'courses',
			select: 'title',
		}),
		getBootcamps
	)
	.post(protect, authorize('publisher', 'admin'), createBootCamp);

module.exports = router;
