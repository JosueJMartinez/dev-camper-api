const ErrorResponse = require('../utils/errorResponse');

function errorHandler(err, req, res, next) {
	let error = { ...err };
	error.message = err.message;

	// Mongoose bad object id
	if (err.name === 'CastError') {
		error = new ErrorResponse(
			`Resource not found with id of ${err.value}`,
			404
		);
	}
	if (error.statusCode === 404)
		console.log(
			`Something went wrong here in getting bootcamp with id: ${err.value}`
				.yellow.underline.bold
		);
	else
		console.log(
			`Something went wrong here in getting bootcamp with id: ${err.value}`
				.red.underline.bold
		);

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || 'Server Error',
	});
}

module.exports = errorHandler;
