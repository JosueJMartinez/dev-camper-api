const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, 'Please add a name'],
		trim: true,
		maxLength: [50, 'Length cannot be more than 50 characters'],
	},
	slug: String,
	email: {
		type: String,
		required: [true, 'Please add an email'],
		unique: true,
		trim: true,
		match: [
			/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
			'Please add a valid email',
		],
	},
	role: {
		type: String,
		required: true,
		enum: ['user', 'publisher'],
		default: 'user',
	},
	password: {
		type: String,
		required: [true, 'Please add a password'],
		minlength: 6,
		select: false,
	},
	resetPasswordToken: String,
	resetPasswordExpire: Date,
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {};

module.exports = mongoose.model('User', UserSchema);
