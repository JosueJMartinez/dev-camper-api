const express = require('express');
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	createBootCamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require('../controllers/bootcamps');

// Includes other resource routers
const courseRouter = require('./courses');
const router = express.Router();

// This is how to reroute into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadius);

router
	.route('/:bootId')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

router.route('/').get(getBootcamps).post(createBootCamp);

module.exports = router;
