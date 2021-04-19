const express = require('express');
const {
	register,
	login,
	getCurrentUser,
	forgotPassword,
} = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getCurrentUser);
router.route('/forgotPassword').post(forgotPassword);

module.exports = router;
