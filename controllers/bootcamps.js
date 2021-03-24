const Bootcamp = require('../models/Bootcamp');

//  @desc     Get all bootcamps
//  @route    Get /api/v1/bootcamps
//  @access   Public
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find({});
		console.log(bootcamps);
		res.status(200).json({
			success: true,
			data: {
				bootcamps,
				count: bootcamps.length,
			},
		});
	} catch (err) {
		console.log(
			'Something went wrong here in getting all bootcamps'.red.underline
				.bold
		);
		return res.status(400).json({ success: false });
	}
};

//  @desc     Create a bootcamp
//  @route    Post /api/v1/bootcamps
//  @access   Private
exports.createBootCamp = async (req, res, next) => {
	try {
		const newBootcamp = new Bootcamp(req.body);

		const addedBootcamp = await newBootcamp.save();

		res.status(201).json({
			success: true,
			data: addedBootcamp,
		});
	} catch (err) {
		console.log(
			'Something went wrong here in creating bootcamp'.red.underline.bold
		);
		return res.status(400).json({ success: false });
	}
};

//  @desc     Get one bootcamp
//  @route    Get /api/v1/bootcamps/:id
//  @access   Public
exports.getBootcamp = async (req, res, next) => {
	const { bootId } = { ...req.params };
	try {
		const bootcamp = await Bootcamp.findById(bootId);

		if (!bootcamp) throw new Error();

		res.status(200).json({
			success: true,
			data: {
				bootcamp,
			},
		});
	} catch (err) {
		console.log(
			`Something went wrong here in getting bootcamp with id: ${bootId}`
				.red.underline.bold
		);
		return res.status(400).json({ success: false });
	}
};

//  @desc     Update Bootcamp
//  @route    Put /api/v1/bootcamps/:id
//  @access   Private
exports.updateBootcamp = async (req, res, next) => {
	const { bootId } = { ...req.params };
	try {
		const updateBootcamp = req.body;
		const bootcamp = await Bootcamp.findByIdAndUpdate(
			bootId,
			updateBootcamp,
			{
				new: true,
				runValidators: true,
			}
		);

		if (!bootcamp) throw new Error();

		res.status(200).json({
			success: true,
			data: {
				bootcamp,
			},
		});
	} catch (err) {
		console.log(
			`Something went wrong here in getting bootcamp with id: ${bootId}`
				.red.underline.bold
		);
		return res.status(400).json({ success: false });
	}
};

//  @desc     Delete bootcamp
//  @route    Delete /api/v1/bootcamps/:id
//  @access   Private
exports.deleteBootcamp = async (req, res, next) => {
	const { bootId } = { ...req.params };
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(bootId);
		if (!bootcamp) throw new Error();

		res.status(200).json({
			success: true,
			data: {
				bootcamp,
			},
		});
	} catch (err) {
		console.log(
			`Something went wrong here in getting bootcamp with id: ${bootId}`
				.red.underline.bold
		);
		return res.status(400).json({ success: false });
	}
};
