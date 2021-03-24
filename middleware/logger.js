// @desc  Logs request to console
logger = (req, res, next) => {
  console.log(
    `Method: ${req.method}, Url: ${req.protocol}://${req.get("host")}${
      req.originalUrl
    }`
  );
  next();
};

module.exports = logger;
