const express = require('express');
const router = express.Router();
const { getAllUsers, getAnalytics } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication (admin check is done in controller)
router.get('/users', authMiddleware, getAllUsers);
router.get('/analytics', authMiddleware, getAnalytics);

module.exports = router;
