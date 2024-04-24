require('dotenv').config();

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI; // MongoDB Atlas connection string

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
module.exports = connectDB;
