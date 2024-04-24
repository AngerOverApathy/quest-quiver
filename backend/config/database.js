require('dotenv').config();

const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI; // MongoDB Atlas connection string

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch(err => {
    console.error('Connection error:', err);
  });

module.exports = mongoose;
