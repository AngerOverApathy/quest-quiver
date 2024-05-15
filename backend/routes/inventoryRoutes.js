const express = require('express');
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middlewares/authMiddleware'); // Import the protect middleware
const router = express.Router();

// Fetch all inventory items for the logged-in user
router.get('/inventory', protect, inventoryController.getUserInventory);

// Add an equipment to user inventory
router.post('/inventory', protect, inventoryController.addEquipmentToInventory);

module.exports = router;
