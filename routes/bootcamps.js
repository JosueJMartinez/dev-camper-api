const express = require('express');
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	createBootCamp,
	deleteBootcamp,
} = require('../controllers/bootcamps');
const router = express.Router();

router.route('/').get(getBootcamps).post(createBootCamp);

router
	.route('/:bootId')
	.get(getBootcamp)
	.put(updateBootcamp)
	.delete(deleteBootcamp);

module.exports = router;
