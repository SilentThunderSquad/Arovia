const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser, googleCallback } = require('../controllers/authController');

const upload = require('../middleware/upload');

// Route for user registration
router.post('/register', upload.single('profileImage'), registerUser);
// Route for user login
router.post('/login', loginUser);

// Google Auth Routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account consent' // Forces consent screen and account selection
}));

router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: '/login', session: false }),
    (req, res) => {
        // Successful authentication
        googleCallback(req, res);
    }
);

module.exports = router;