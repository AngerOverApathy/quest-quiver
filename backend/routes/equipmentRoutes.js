const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController'); 
//const { protect } = require('../middleware/authMiddleware');

//Routes
router.post('/', equipmentController.createEquipment);               // Create new equipment
router.get('/', equipmentController.getAllEquipment);                // Get all equipment items
router.get('/:id', equipmentController.getEquipmentById);            // Get a single equipment item by ID
router.put('/:id', equipmentController.updateEquipment);             // Update an equipment item
router.delete('/:id', equipmentController.deleteEquipment);          // Delete an equipment item

module.exports = router;
