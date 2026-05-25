'use strict';

const { Router } = require('express');
const authMiddleware = require('../../middleware/auth.middleware');
const { uploadProfileAndPrescription, handleMulterError } = require('../../middleware/upload.middleware');
const {
  getUserProfile, updateProfile, updateAddress,
  changePassword, uploadPrescription, deletePrescription, deleteAccount,
} = require('./user.controller');

const router = Router();

router.use(authMiddleware);

router.get('/profile', getUserProfile);
router.put('/profile', uploadProfileAndPrescription, handleMulterError, updateProfile);
router.put('/address', updateAddress);
router.post('/change-password', changePassword);
router.post('/prescription', uploadProfileAndPrescription, handleMulterError, uploadPrescription);
router.delete('/prescription/:id', deletePrescription);
router.delete('/delete-account', deleteAccount);

module.exports = router;
