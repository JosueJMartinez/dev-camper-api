const path = require('path'),
	express = require('express'),
	dotenv = require('dotenv'),
	morgan = require('morgan'),
	fileUpload = require('express-fileupload'),
	cookieParser = require('cookie-parser'),
	colors = require('colors'),
	mongoSanitize = require('express-mongo-sanitize'),
	helmet = require('helmet'),
	xss = require('xss-clean'),
	rateLimit = require('express-rate-limit'),
	hpp = require('hpp'),
	cors = require('cors');

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
const reviews = require('./routes/reviews');

const { PORT, NODE_ENV } = { ...process.env };
const app = express();

// Body Parser
app.use(express.json());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// middleware for fileuploads
app.use(fileUpload());
// Cookie parser middleware
app.use(cookieParser());
// To remove data, use:
app.use(mongoSanitize());
// Set security headers
app.use(helmet({ contentSecurityPolicy: false }));
// Prevent XSS attacks
app.use(xss());
// Prevent http param pollution
app.use(hpp());
// Enable CORS
app.use(cors());

const limiter = rateLimit({
	windowMs: 30 * 60 * 1000, // 30 minutes
	max: 100, // limit each IP to 100 requests per windowMs
});

//  apply to all requests
app.use(limiter);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/reviews', reviews);

// Secret route for jenny for fun
app.get('/api/v1/jen', (req, res) => {
	let jen = [];
	const nouns = ['booty', 'butt', 'ass'];

	for (let i = 1; i < 101; i++) {
		const rand = Math.floor(Math.random() * 3);
		jen.push(`Jenny Jen Jen smells like ${nouns[rand]}!`);
	}
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
