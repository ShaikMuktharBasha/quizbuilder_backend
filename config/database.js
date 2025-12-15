const mongoose = require('mongoose');
require('dotenv').config();

// Global variable to cache the connection across invocations in serverless
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    console.log('MongoDB connection cached');
    return cached.conn;
  }

  const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI or MONGO_URI environment variable is not defined');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable mongoose buffering
      serverSelectionTimeoutMS: 5000, // Fail after 5 seconds if can't connect
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('MongoDB Connected');
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw e;
  }

  return cached.conn;
};

module.exports = connectDB;