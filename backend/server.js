require('dotenv').config();

const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
const PORT = process.env.PORT || 5050;

// database.js
const connectDB = require('./config/database.js');

// Call the function to connect to the database
connectDB();

//Import routes
const itemRoutes = require('./routes/itemRoutes'); 

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/items', itemRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });