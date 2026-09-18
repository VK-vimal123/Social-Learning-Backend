const mongoose = require('mongoose');

let isConnected = false; // Track connection status

const connectDB = async () => {
  if (isConnected) {
    console.log('MongoDB is already connected.');
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Fail fast if can't connect
    });

    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
      isConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
      isConnected = true;
    });
    
  } catch (error) {
    console.error('Database connection error:', error.message);
    // Do not recursively call connectDB on error in serverless,
    // otherwise it might cause infinite loops or memory leaks.
    isConnected = false;
  }
};

module.exports = connectDB;
