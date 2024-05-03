const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    createEquipment,
    getAllEquipment,
    getEquipmentById,
    updateEquipment,
    deleteEquipment
} = require('../controllers/equipmentController'); 

//Routes
router.post('/', protect, createEquipment);               // Create new equipment
router.get('/', protect, getAllEquipment);                // Get all equipment items
router.get('/:id', protect, getEquipmentById);            // Get a single equipment item by ID
router.put('/:id', protect, updateEquipment);             // Update an equipment item
router.delete('/:id', protect, deleteEquipment);          // Delete an equipment item

module.exports = router;
