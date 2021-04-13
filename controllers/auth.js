const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
// const geocoder = require('../utils/geocoder');

//  @desc     Register User
//  @route    Post /api/v1/auth/register
//  @access   Public
exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	// Create user
	const user = await User.create({
		name,
		email,
		password,
		role,
	});

	sendTokenResponse(user, 200, res);
});

//  @desc     Login User
//  @route    Post /api/v1/auth/login
//  @access   Public
exports.login = asyncHandler(async (req, res, next) => {
	const { email, password } = req.body;

	// Validate Email & password

	if (!email || !password) {
		throw new ErrorResponse(
			'Please enter a valid email and password',
			400
		);
	}

	// Check for user
	const user = await User.findOne({ email }).select('+password');
	if (!user) {
		throw new ErrorResponse('Invalid credentials', 401);
	}

	// Check if password matches
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		throw new ErrorResponse('Invalid credentials', 401);
	}

	sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send resp
const sendTokenResponse = (user, statusCode, res) => {
	// Create token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXP * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	if (process.env.NODE_ENV === 'production') options.secure = true;

	res
		.status(statusCode)
		.cookie('token', token, options)
		.json({ success: true, token });
};

//  @desc     Get Current User
//  @route    Get /api/v1/auth/me
//  @access   Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
	const { user } = { ...req };
	console.log(user);
	res.status(200).json({ success: true, data: user });
});
