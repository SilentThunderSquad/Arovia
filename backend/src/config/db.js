const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
    return;
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    // Hide password in logs for safety
    const maskedURI = process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@");
    console.log(`URI: ${maskedURI}`);
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Fast fail if no server found
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};

module.exports = connectDB;