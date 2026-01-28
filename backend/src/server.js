// Server Entry Point
const cors = require('cors');

const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
module.exports = app;