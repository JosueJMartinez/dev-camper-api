function errorHandler (err, req, res, next) {
	console.log(err.stack.red.underline.bold);
  // if (res.headersSent) {
  //   return next(err)
  // }
  res.status(500).json({success:false, error:err.message})
  // res.render('error', { error: err })
}

module.exports = errorHandler;