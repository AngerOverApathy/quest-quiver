const express = require('express');
const app = express();
require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');

// Database connection
const connectDB = require('./config/database');
connectDB();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const equipmentRoutes = require('./routes/equipmentRoutes');
const userRoutes = require('./routes/userRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');

// Use routes
app.use('/equipment', equipmentRoutes);
app.use('/user', userRoutes);
app.use('/inventory', inventoryRoutes);

// Error Handler Middleware - should be after all route handlers
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});