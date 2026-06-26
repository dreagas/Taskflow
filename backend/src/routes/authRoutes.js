const express = require('express');
const { registerUser, loginUser, getAuthenticatedUserProfile } = require('../controllers/authController');
const { requireAuthentication } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', requireAuthentication, getAuthenticatedUserProfile);

module.exports = router;
