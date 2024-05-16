const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController'); 
const { protect } = require('../middleware/authMiddleware');

//Routes
router.post('/', protect, equipmentController.createEquipment);               // Create new equipment
router.get('/', protect, equipmentController.getAllEquipment);                // Get all equipment items
router.get('/:id', protect, equipmentController.getEquipmentById);            // Get a single equipment item by ID
router.put('/:id', protect, equipmentController.updateEquipment);             // Update an equipment item
router.delete('/:id', protect, equipmentController.deleteEquipment);          // Delete an equipment item

router.get('/external/:index', equipmentController.fetchData); // Route to fetch equipment data from an external API

module.exports = router;
