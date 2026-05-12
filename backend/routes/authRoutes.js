const express = require('express');
const { getProfile, registerProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register-profile', registerProfile);
router.get('/me', protect, getProfile);

module.exports = router;
