const express = require('express');
const router = express.Router();

const {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment
} = require('../controllers/itemController'); // Ensure the path matches the actual location

// Define routes
router.post('/', createEquipment);               // Create new equipment
router.get('/', getAllEquipment);                // Get all equipment items
router.get('/:id', getEquipmentById);            // Get a single equipment item by ID
router.put('/:id', updateEquipment);             // Update an equipment item
router.delete('/:id', deleteEquipment);          // Delete an equipment item

module.exports = router;
