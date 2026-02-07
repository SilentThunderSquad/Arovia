const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    const error = new Error("MONGO_URI is not defined in environment variables!");
    console.error("❌ ERROR:", error.message);
    throw error;
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    // Hide password in logs for safety
    const maskedURI = process.env.MONGO_URI.replace(/:([^@]+)@/, ":****@");
    console.log(`URI: ${maskedURI}`);

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    throw error; // Re-throw to prevent server from starting
  }
};

module.exports = connectDB;