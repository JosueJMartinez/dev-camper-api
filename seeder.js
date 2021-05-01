const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp'),
	Course = require('./models/Course'),
	User = require('./models/User'),
	Review = require('./models/Review');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

// Read the JSON files
const bootcamps = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/bootcamps.json`),
	'utf-8'
);
const courses = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/courses.json`),
	'utf-8'
);
const users = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/users.json`),
	'utf-8'
);
const reviews = JSON.parse(
	fs.readFileSync(`${__dirname}/_data/reviews.json`),
	'utf-8'
);

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		await Course.create(courses);
		await Review.create(reviews);
		await User.create(users);

		console.log('Data Imported...'.green.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
		console.log('Error importing seed data'.red.inverse);
		process.exit();
	}
};

// Delete Data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		await Course.deleteMany();
		await User.deleteMany();
		await Review.deleteMany();

		console.log('All data destroyed'.green.inverse);
		process.exit();
	} catch (err) {
		console.log(err);
		console.log('Error deleting seed data'.red.inverse);
		process.exit();
	}
};

if (process.argv[2].toLowerCase() === '-i') {
	importData();
} else if (process.argv[2].toLowerCase() === '-d') {
	deleteData();
} else {
	console.log('Please enter -i to import or -d to delete data');
	process.exit();
}
