//  @desc     Get all bootcamps
//  @route    Get /api/v1/bootcamps
//  @access   Public
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: "show all bootcamps",
    },
  });
  // next();
};

//  @desc     Create a bootcamp
//  @route    Post /api/v1/bootcamps
//  @access   Private
exports.createBootCamp = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: "create new bootcamp",
    },
  });
  // next();
};

//  @desc     Get one bootcamp
//  @route    Get /api/v1/bootcamps/:id
//  @access   Public
exports.getBootcamp = (req, res, next) => {
  const { bootId } = { ...req.params };
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: `show bootcamp ${bootId}`,
      bootId,
    },
  });
  // next();
};

//  @desc     Update Bootcamp
//  @route    Put /api/v1/bootcamps/:id
//  @access   Private
exports.updateBootcamp = (req, res, next) => {
  const { bootId } = { ...req.params };
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: `update bootcamp ${bootId}`,
      bootId,
    },
  });
  // next();
};

//  @desc     Delete bootcamp
//  @route    Delete /api/v1/bootcamps/:id
//  @access   Private
exports.deleteBootcamp = (req, res, next) => {
  const { bootId } = { ...req.params };
  res.status(200).json({
    success: true,
    data: {
      first_name: "Josue",
      last_name: "Martinez",
      id: 10023,
      route: `delete bootcamp ${bootId}`,
      bootId,
    },
  });
  // next();
};
