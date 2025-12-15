const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB connection already established.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In serverless, we shouldn't exit the process, but we should probably throw
    throw error;
  }
};

module.exports = connectDB;