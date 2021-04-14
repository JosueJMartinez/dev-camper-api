const ErrorResponse = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
	let error = { ...err };
	error.message = err.message;
	console.log(err);
	if (err.name === 'CastError') {
		error = new ErrorResponse(
			`Resource not found with id of ${err.value}`,
			404
		);
	}

	// Mongoose Duplicate Error
	if (error.code === 11000)
		error = new ErrorResponse(
			`Duplicate name found trying to create this resource`,
			400
		);

	// Mongoose validation error
	if (err.name === 'ValidationError') {
		const msg = Object.values(err.errors).map(val => val.message);
		error = new ErrorResponse(msg, 400);
	}

	if (err.name === 'JsonWebTokenError') {
		error = new ErrorResponse(`Not authorized`, 401);
	}

	// Server Console log errors
	if (error.statusCode === 404)
		console.log(
			`404 error getting resource with id: ${err.value}`.yellow.underline
				.bold
		);
	else
		console.log(
			`${error.message}: ${error.statusCode}`.red.underline.bold
		);

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server Error',
	});
}

module.exports = errorHandler;
