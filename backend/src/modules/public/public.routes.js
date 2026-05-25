'use strict';

const { Router } = require('express');
const rateLimit = require('express-rate-limit');
const { checkUsername, getUserProfile, getDoctorProfile } = require('./public.controller');

// Create a strict rate limiter for the username check endpoint to prevent enumeration
const usernameCheckLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 checks per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: 'Too many username availability checks. Please try again in a minute.',
  },
});

const router = Router();

// Public routes do NOT require authMiddleware or adminMiddleware
router.get('/username-check/:username', usernameCheckLimiter, checkUsername);
router.get('/user/:username', getUserProfile);
router.get('/doctor/:username', getDoctorProfile);

module.exports = router;
