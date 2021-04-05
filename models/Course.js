const mongoose = require('mongoose');
const slugify = require('slugify');

const CourseSchema = new mongoose.Schema({
	title: {
		type: String,
		trim: true,
		required: [true, 'Please add a course title'],
		maxLength: [50, 'Length cannot be more than 50 characters'],
		unique: true,
	},
	description: {
		type: String,
		required: [true, 'Please add a course description'],
		maxLength: [500, 'Length cannot be more than 500 characters'],
	},
	weeks: {
		type: String,
		required: [true, 'Please add a number of weeks'],
	},
	tuition: {
		type: Number,
		required: [true, 'Please add a tuition cost'],
	},
	minimumSkill: {
		type: String,
		required: [true, 'Please add a minimum skill'],
		enum: ['beginner', 'intermediate', 'advanced'],
	},
	scholarshipsAvailable: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	bootcamp: {
		type: mongoose.Schema.ObjectId,
		ref: 'Bootcamp',
		required: true,
	},
	slug: String,
});

CourseSchema.pre('save', function (next) {
	this.slug = slugify(this.title, { lower: true, replacement: '_' });
	next();
});

module.exports = mongoose.model('Course', CourseSchema);
