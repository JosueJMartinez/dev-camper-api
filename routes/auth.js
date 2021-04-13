const express = require('express');
const { register, login, getCurrentUser } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/me').get(protect, getCurrentUser);

module.exports = router;
