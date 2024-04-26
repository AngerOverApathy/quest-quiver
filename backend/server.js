require('dotenv').config();

const express = require('express');
const app = express();
// const bodyParser = require('body-parser');
// const cors = require('cors');
const PORT = process.env.PORT || 5050;

// database.js
const mongoose = require('./config/database.js');

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Import routes
const itemRoutes = require('./routes/itemRoutes'); 

// Use routes
app.use('/api/items', itemRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });