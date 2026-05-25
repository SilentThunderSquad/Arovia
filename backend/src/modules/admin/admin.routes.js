'use strict';

const { Router } = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const adminMiddleware = require('../../middleware/admin.middleware');
const {
  getAllUsers, getAnalytics, deleteUser, toggleUserStatus,
  getAllDoctors, getDoctorByName, deleteDoctor,
} = require('./admin.controller');

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/users', getAllUsers);
router.get('/analytics', getAnalytics);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/status', toggleUserStatus);
router.get('/doctors', getAllDoctors);
router.get('/doctors/:name', getDoctorByName);
router.delete('/doctors/:id', deleteDoctor);

module.exports = router;
