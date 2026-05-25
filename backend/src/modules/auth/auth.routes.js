'use strict';

const { Router } = require('express');
const { registerUser, loginUser } = require('./auth.controller');
const { uploadProfileImage, handleMulterError } = require('../../middleware/upload.middleware');

const router = Router();

router.post('/register', uploadProfileImage, handleMulterError, registerUser);
router.post('/login', loginUser);

module.exports = router;
