const mongoose = require('mongoose');

const uri = "mongodb+srv://superhaiderkhan_db_user:R6Caxj9GYSmyMjX2@cluster0.8k30hmg.mongodb.net/?appName=Cluster0";

async function connectDB() {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
