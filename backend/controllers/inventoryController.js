const UserInventory = require('../models/userInventorySchema');

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

      const newItem = new UserInventory({
        userId: req.user.id,
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
  }
};
