// let mongo=require("mongoose");
// exports.health=()=>
// {
// mongo.connect("mongodb://localhost:27017/health")
// console.log('successfully connected')
// }

let mongoose=require("mongoose");

require('dotenv').config();

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri);

const health = mongoose.connection;

health.on('connected', () => {
  console.log("Connected to MongoDB successfully");
});

health.on('error', (error) => {
  console.error("Error connecting to MongoDB:", error.message);
});

health.on('disconnected', () => {
  console.log("Disconnected from MongoDB");
});

module.exports = health;