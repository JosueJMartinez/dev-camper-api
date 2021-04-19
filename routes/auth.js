const express = require('express');
const {
	register,
	login,
	getCurrentUser,
	forgotPassword,
	resetPassword,
	updateUser,
	updatePassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getCurrentUser);
router.route('/updateMe').put(protect, updateUser);
router.route('/updatePassword').put(protect, updatePassword);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:resetToken').put(resetPassword);

module.exports = router;
