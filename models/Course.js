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
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: true,
	},
});

// Slugify Course name
CourseSchema.pre('save', function (next) {
	this.slug = slugify(this.title, { lower: true, replacement: '_' });
	next();
});

// Static method to get average cost on the model for Course
CourseSchema.statics.getAverageCost = async function (bootcampId) {
	const obj = await this.aggregate([
		{ $match: { bootcamp: bootcampId } },
		{ $group: { _id: '$bootcamp', averageCost: { $avg: '$tuition' } } },
	]);
	// Possible refactor this into asyncHandler function
	try {
		await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
			averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
		});
	} catch (err) {
		console.log('there was an error');
	}
};

//  Call getAverageCost after save
CourseSchema.post('save', function () {
	this.constructor.getAverageCost(this.bootcamp);
});

//  Call getAverageCost before remove
CourseSchema.pre('remove', function () {
	this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model('Course', CourseSchema);
