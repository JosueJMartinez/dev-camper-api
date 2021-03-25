class ErrorResponse extends Error {
	constructor(message, statusCode, value) {
		super(message);
		this.statusCode = statusCode;
		this.value = value;
	}
}

module.exports = ErrorResponse;
