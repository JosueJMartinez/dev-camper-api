const express = require('express'),
	dotenv = require('dotenv'),
	morgan = require('morgan'),
	colors = require('colors');

// DB Connection
const connectDB = require('./config/db');

// Load config file for env vars
dotenv.config({ path: './config/config.env' });

// call and connect to db connection
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

const { PORT, NODE_ENV } = { ...process.env };
const app = express();

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.get('*', (req, res) => {
	res.status(404).json({ success: false, message: 'page not found' });
});

const server = app.listen(PORT, () => {
	console.log(
		`Dev Boot Camp running in ${NODE_ENV} mode on port: ${PORT}`.underline
			.magenta.bold
	);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.bold.underline.red);
	// Close server and exit process
	server.close(() => process.exit(1));
});
