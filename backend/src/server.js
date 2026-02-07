// Server Entry Point
const cors = require('cors');
const express = require('express');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables from backend/.env (only in local development)
// On Vercel, environment variables are already available via process.env
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log('📁 Loaded environment variables from .env file');
} else {
    console.log('☁️ Using environment variables from hosting platform (Vercel)');
}

// Debug: Log which environment variables are available (without exposing values)
console.log('🔍 Environment variables check:', {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✓ Set' : '✗ Missing',
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? '✓ Set' : '✗ Missing',
    MONGO_URI: process.env.MONGO_URI ? '✓ Set' : '✗ Missing',
    JWT_SECRET: process.env.JWT_SECRET ? '✓ Set' : '✗ Missing',
    SESSION_SECRET: process.env.SESSION_SECRET ? '✓ Set' : '✗ Missing',
    CLIENT_URL: process.env.CLIENT_URL ? '✓ Set' : '✗ Missing',
    NODE_ENV: process.env.NODE_ENV || 'development'
});

const connectDB = require('./config/db');
connectDB();

const passport = require('./config/passport');
const session = require('express-session');

const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Adjust based on your frontend URL
    credentials: true,
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads', 'prescriptions');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'Server is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const PORT = process.env.PORT || 5000;

// Only listen if running directly (not when imported by Vercel)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
module.exports = app;