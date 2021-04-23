const mongoose = require('mongoose');
// const opts = { toJSON: { virtuals: true }, toObject: { virtuals: true } };

const ReviewSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, 'Please add a title'],
			trim: true,
			maxLength: [50, 'Length cannot be more than 50 characters'],
		},

		text: {
			type: String,
			required: [true, 'Please add some text'],
			maxLength: [500, 'Length cannot be more than 500 characters'],
		},
		rating: {
			type: Number,
			min: 1,
			max: 10,
			required: [true, 'Please add a rating between 1 and 10'],
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			required: true,
		},
		bootcamp: {
			type: mongoose.Schema.ObjectId,
			ref: 'Bootcamp',
			required: true,
		},
	}
	// opts
);

module.exports = mongoose.model('Review', ReviewSchema);
