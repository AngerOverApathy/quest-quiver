const UserInventory = require('../models/userInventorySchema');
const Equipment = require('../models/equipmentSchema');

const inventoryController = {
  // Fetch all inventory items for the logged-in user
  async getUserInventory(req, res) {
    try {
      const userInventory = await UserInventory.find({ user: req.user.id })
        .populate('equipmentId')  // Assuming you want to fetch details of the equipment
        .exec();

      res.status(200).json(userInventory);
    } catch (error) {
      console.error("Error fetching user inventory:", error);
      res.status(500).json({ message: "Failed to fetch user inventory", error: error.message });
    }
  },
  
  // Add an equipment to user inventory
  async addEquipmentToInventory(req, res) {
    try {
      const { equipmentId, quantity, customizations } = req.body;

      // Ensure the equipment exists
      const equipment = await Equipment.findById(equipmentId);
      if (!equipment) {
        return res.status(404).json({ message: "Equipment not found" });
      }

      const newItem = new UserInventory({
        user: req.user.id,
        equipmentId,
        quantity,      
        customizations
      });

      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error) {
      console.error("Error adding item to inventory:", error);
      res.status(400).json({
        message: "Failed to add item to inventory",
        error: error.message
      });
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
