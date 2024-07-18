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
    const { id } = req.params;
    const { quantity, customizations, equipmentData } = req.body;

    // Update the inventory item
    const inventoryItem = await UserInventory.findByIdAndUpdate(
      id,
      { quantity, customizations },
      { new: true, runValidators: true }  // Return the updated object and run schema validations
    );

    if (!inventoryItem) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Update the associated equipment item if equipmentData is provided
    if (equipmentData) {
      const equipmentId = inventoryItem.equipmentId;
      const updatedEquipment = await Equipment.findByIdAndUpdate(
        equipmentId,
        equipmentData,
        { new: true, runValidators: true }  // Return the updated object and run schema validations
      );

      if (!updatedEquipment) {
        return res.status(404).json({ message: 'Equipment item not found' });
      }

      inventoryItem.equipmentId = updatedEquipment; // Embed the updated equipment in the response
    }

    res.status(200).json(inventoryItem);
  } catch (error) {
    console.error("Error updating inventory item:", error);
    res.status(400).json({ message: "Failed to update inventory item", error: error.message });
  }
},

  //Delete Equipment
  async deleteItem(req, res) {
    const { itemId } = req.params;  // The ID of the inventory item to be deleted
    console.log(`Attempting to delete item with ID: ${itemId}`);
    try {
      // Find and delete the inventory item by its ID
      const inventoryResult = await UserInventory.findByIdAndDelete(itemId);
      if (!inventoryResult) {
        console.log(`Inventory item with ID ${itemId} not found`);
        return res.status(404).json({ message: 'Inventory item not found' });
      }

      console.log(`Deleted inventory item with ID: ${itemId}`);

      // Extract the equipmentId from the deleted inventory item
      const equipmentId = inventoryResult.equipmentId;

      // Check if any other inventory items are using the same equipment
      const otherInventoryItems = await UserInventory.find({ equipmentId });

      if (otherInventoryItems.length === 0) {
        // If no other inventory items are using the equipment, delete the equipment
        const equipmentResult = await Equipment.findByIdAndDelete(equipmentId);
        console.log(`Deleted equipment item with ID: ${equipmentId}`);
      } else {
        console.log(`Equipment item with ID: ${equipmentId} is still in use`);
      }

      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      console.error(`Error deleting item with ID: ${itemId}`, error);
      res.status(500).json({ message: 'Error deleting item', error });
    }
  }
};

module.exports = inventoryController;
