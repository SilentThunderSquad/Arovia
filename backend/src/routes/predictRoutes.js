const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { predict } = require('../controllers/predictionController');

// Prediction requires a logged in user (uses token)
router.post('/', authMiddleware, predict);

module.exports = router;
