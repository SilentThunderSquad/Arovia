const express = require('express');
const router = express.Router();
const { getAllUsers, getAnalytics } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes require authentication (admin check is done in controller)
router.get('/users', authMiddleware, getAllUsers);
router.get('/doctors', authMiddleware, require('../controllers/adminController').getAllDoctors);
router.get('/doctors/:name', authMiddleware, require('../controllers/adminController').getDoctorByName);
router.get('/analytics', authMiddleware, getAnalytics);
router.delete('/users/:id', authMiddleware, require('../controllers/adminController').deleteUser);
router.delete('/doctors/:id', authMiddleware, require('../controllers/adminController').deleteDoctor);
router.patch('/users/:id/status', authMiddleware, require('../controllers/adminController').toggleUserStatus);

module.exports = router;
