const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, inventoryController.getUserInventory);
router.post('/', protect, inventoryController.addEquipmentToInventory);
router.put('/:id', protect, inventoryController.updateInventoryItem);

module.exports = router;
