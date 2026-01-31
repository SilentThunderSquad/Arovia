const express = require('express');
const router = express.Router();
const { getUserProfile, uploadPrescription } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/profile', authMiddleware, getUserProfile);
router.post('/prescription', authMiddleware, uploadPrescription);

module.exports = router;
