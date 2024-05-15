const Equipment = require('../models/equipmentSchema');

const equipmentController = {
  // Create a new equipment item
  async createEquipment(req, res) {
    try {
      const newEquipment = new Equipment(req.body);
      const savedEquipment = await newEquipment.save();
      res.status(201).json(savedEquipment);
    } catch (error) {
      console.error("Error when creating equipment:", error);
      res.status(400).json({
        message: 'Failed to create new equipment',
        error: error.message, // Provide more specific error message
        stack: error.stack    // Optionally include the stack trace for deeper analysis
      });
    }
  },

  // Get all equipment items
  async getAllEquipment(req, res) {
    try {
      const equipments = await Equipment.find({ user: req.user.id });
      res.status(200).json(equipments);
    } catch (error) {
      res.status(500).json({ message: 'Failed to get equipment', error });
    }
  },

  // Get a single equipment item by ID
  async getEquipmentById(req, res) {
    try {
      const equipment = await Equipment.findById(req.params.id);
      if (!equipment) {
        res.status(404).json({ message: 'Equipment not found' });
      } else {
        res.status(200).json(equipment);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to get equipment', error });
    }
  },

  // Update an equipment item
  async updateEquipment(req, res) {
    try {
      const updatedEquipment = await Equipment.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      if (!updatedEquipment) {
        res.status(404).json({ message: 'Equipment not found' });
      } else {
        res.status(200).json(updatedEquipment);
      }
    } catch (error) {
      res.status(400).json({ message: 'Failed to update equipment', error });
    }
  },

  // Delete an equipment item
  async deleteEquipment(req, res) {
    try {
      const result = await Equipment.findByIdAndDelete(req.params.id);
      if (result) {
        res.status(200).json({ message: 'Equipment deleted successfully' });
      } else {
        res.status(404).json({ message: 'Equipment not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete equipment', error });
    }
  }
};

module.exports = equipmentController;