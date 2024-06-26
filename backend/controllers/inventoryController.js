const UserInventory = require('../models/userInventorySchema');
const Equipment = require('../models/equipmentSchema');
const mongoose = require('mongoose');

const inventoryController = {
  // Fetch all inventory items for the logged-in user
  async getUserInventory(req, res) {
    try {
      const userId = req.user.id;
      const userInventory = await UserInventory.find({ user: userId }).populate('equipmentId');
      res.status(200).json(userInventory);
    } catch (error) {
      console.error("Error fetching user inventory:", error);
      res.status(500).json({ message: "Failed to fetch user inventory" });
    }
  },

  // Add to inventory
  async addToInventory(req, res) {
    try {
      const userId = req.user.id;
      const { item } = req.body;

      console.log('Received item:', JSON.stringify(item, null, 2));

      // Save to user's inventory
      const newItem = new UserInventory({
        user: userId,
        equipmentId: item._id, // Reference the MongoDB ObjectId
        quantity: item.quantity || 1,
        customizations: item.customizations || '',
        acquiredDate: new Date()
      });

      const savedItem = await newItem.save();
      console.log('Saved item to inventory:', JSON.stringify(savedItem, null, 2));
      res.status(201).json(savedItem);
    } catch (error) {
      console.error("Error adding item to inventory:", error);
      res.status(500).json({ message: "Failed to add item to inventory", error: error.message });
    }
  },

  // Update an inventory item
  async updateInventoryItem(req, res) {
    try {
      const { quantity, customizations } = req.body;
      const inventoryItem = await UserInventory.findByIdAndUpdate(
        req.params.id,
        { quantity, customizations },
        { new: true, runValidators: true }  // Return the updated object and run schema validations
      );

      if (!inventoryItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }

      res.status(200).json(inventoryItem);
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(400).json({ message: "Failed to update inventory item", error: error.message });
    }
  },

  // Delete an inventory item
  async deleteInventoryItem(req, res) {
    try {
      const deletedItem = await UserInventory.findByIdAndDelete(req.params.id);

      if (!deletedItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }

      res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item", error: error.message });
    }
  }
};

module.exports = inventoryController;