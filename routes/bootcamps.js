const express = require('express');
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	createBootCamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require('../controllers/bootcamps');
const router = express.Router();

router.route('/radius/:zipcode/:distance/:unit').get(getBootcampsInRadius);

router
	.route('/:bootId')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

router.route('/').get(getBootcamps).post(createBootCamp);

module.exports = router;
