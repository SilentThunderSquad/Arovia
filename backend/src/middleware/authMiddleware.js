const jwt = require('jsonwebtoken');


// Middleware to protect routes
module.exports = function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Bearer token

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};