const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

// Load models
const Bootcamp = require('./models/Bootcamp');

// Connect to DB
mongoose.connect('mongodb+srv://josue:Rings218@cluster0.jkann.mongodb.net/devbootcamp?retryWrites=true&w=majority', {
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

// Import into DB
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log('Data Imported Bootcamps...'.green.inverse);
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
		console.log('All data destroyed for bootcamps'.green.inverse);
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
