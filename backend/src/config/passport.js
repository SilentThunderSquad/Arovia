const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.NODE_ENV === 'production' 
                ? 'https://arovia-silentthundersquad.vercel.app/api/auth/google/callback' 
                : '/api/auth/google/callback',
            proxy: true, // Important for Vercel/Heroku to trust headers
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({
                    $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
                });

                if (user) {
                    // If user exists but no googleId, add it (linking accounts)
                    if (!user.googleId) {
                        user.googleId = profile.id;
                        // If user has no profile picture and Google provides one, we can update it
                        if (!user.profilePicture && profile.photos && profile.photos[0]) {
                            user.profilePicture = profile.photos[0].value;
                        }
                        await user.save();
                    }
                    return done(null, user);
                }

                // If user doesn't exist, create new one
                user = new User({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    profilePicture: profile.photos && profile.photos[0] ? profile.photos[0].value : '',
                    role: 'user', // Default role
                });

                await user.save();
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

module.exports = passport;
