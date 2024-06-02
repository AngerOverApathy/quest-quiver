const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/add', protect, inventoryController.addToInventory); //add fetched item to inventory
router.get('/', protect, inventoryController.getUserInventory);
router.put('/:id', protect, inventoryController.updateInventoryItem);
router.delete('/:id', protect, inventoryController.deleteInventoryItem);

module.exports = router;
