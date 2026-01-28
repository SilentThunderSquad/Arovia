const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // In serverless, do NOT exit process, just log error so the app can still start
    // process.exit(1); 
  }
};

module.exports = connectDB;