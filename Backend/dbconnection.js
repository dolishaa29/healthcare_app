let mongoose = require("mongoose");

require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri).catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
});

const health = mongoose.connection;

health.on('connected', () => {
  console.log("Connected to MongoDB successfully");
});

health.on('error', (error) => {
  console.error("MongoDB connection error:", error.message);
});

health.on('disconnected', () => {
  console.log("Disconnected from MongoDB");
});

module.exports = health;