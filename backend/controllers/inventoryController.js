const UserInventory = require('../models/userInventorySchema');
const Equipment = require('../models/equipmentSchema');
const { saveFetchedEquipment } = require('./equipmentController');
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

      // Save fetched equipment
      const equipment = await saveFetchedEquipment(item);

      // Check if the item already exists in the user's inventory
      let inventoryItem = await UserInventory.findOne({ user: userId, equipmentId: equipment._id });

      if (inventoryItem) {
        // If item exists, update the quantity and customizations
        inventoryItem.quantity += item.quantity || 1;
        inventoryItem.customizations = item.customizations || '';
      } else {
        // If item does not exist, create a new entry
        inventoryItem = new UserInventory({
          user: userId,
          equipmentId: equipment._id,
          quantity: item.quantity || 1,
          customizations: item.customizations || '',
          acquiredDate: new Date()
        });
        // Log the new inventory item data
        console.log('New inventory item created:', JSON.stringify(inventoryItem, null, 2));
      }

      const savedItem = await inventoryItem.save();
      // Log the saved item data
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

  //Delete Equipment
  async deleteItem(req, res) {
    const { itemId } = req.params;
    console.log(`Attempting to delete item with ID: ${itemId}`);
    try {
      const inventoryResult = await UserInventory.findByIdAndDelete(itemId);
      if (!inventoryResult) {
        console.log(`Inventory item with ID ${itemId} not found`);
        return res.status(404).json({ message: 'Inventory item not found' });
      }

      console.log(`Deleted inventory item with ID: ${itemId}`);

      // Optionally, delete the item from the Equipment collection if necessary
      const equipmentResult = await Equipment.findByIdAndDelete(itemId);
      console.log(`Deleted equipment item with ID: ${itemId}`);

      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(`Error deleting item with ID: ${itemId}`, error);
      res.status(500).json({ message: 'Error deleting item', error });
    }
  }
};

module.exports = inventoryController;
