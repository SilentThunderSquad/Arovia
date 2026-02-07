const express = require('express');
const router = express.Router();
const { getUserProfile, uploadPrescription } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication
// Basic Profile & Prescription
router.get('/profile', authMiddleware, getUserProfile);
router.post('/prescription', authMiddleware, uploadPrescription);

// New Routes
router.put('/profile', authMiddleware, require('../controllers/userController').updateProfile);
router.put('/address', authMiddleware, require('../controllers/userController').updateAddress);
router.post('/change-password', authMiddleware, require('../controllers/userController').changePassword);
router.delete('/prescription/:id', authMiddleware, require('../controllers/userController').deletePrescription);
router.delete('/delete-account', authMiddleware, require('../controllers/userController').deleteAccount);

module.exports = router;
