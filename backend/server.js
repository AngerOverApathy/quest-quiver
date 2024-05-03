require('dotenv').config();

const express = require('express');
const app = express();
const { errorHandler } = require('./middleware/errorMiddleware.js')   
const PORT = process.env.PORT || 5050;

// Database connection
const connectDB = require('./config/database.js');
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const equipmentRoutes = require('./routes/equipmentRoutes');
const userRoutes = require('./routes/userRoutes');

// Use routes
app.use('/equipment', equipmentRoutes);
app.use('/user', userRoutes);
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
