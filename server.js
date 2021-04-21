const path = require('path'),
	express = require('express'),
	dotenv = require('dotenv'),
	morgan = require('morgan'),
	fileUpload = require('express-fileupload'),
	cookieParser = require('cookie-parser'),
	colors = require('colors');

const errorHandler = require('./middleware/error');

// DB Connection
const connectDB = require('./config/db');

// Load config file for env vars
dotenv.config({ path: './config/config.env' });

// call and connect to db connection
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');

const { PORT, NODE_ENV } = { ...process.env };
const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
// middleware for fileuploads
app.use(fileUpload());
// Cookie parser middleware
app.use(cookieParser());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);

// Secret route for jenny for fun
app.get('/api/v1/jen', (req, res) => {
	let jen = [];
	for (let i = 1; i < 101; i++)
		jen.push('Jenny Jen Jen smells like booty!');
	res.status(200).json({ success: true, jen });
});

app.get('*', (req, res) => {
	res.status(404).json({ success: false, message: 'page not found' });
});

app.use(errorHandler);

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
