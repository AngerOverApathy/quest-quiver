const Equipment = require('../models/itemSchema');

// Create a new equipment item
const createEquipment = async (req, res) => {
  try {
    const newEquipment = new Equipment(req.body);
    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error("Error when creating equipment:", error);
    res.status(400).json({
      message: 'Failed to create new equipment',
      error: error.toString(),  // Change this to see if it helps capture the error message
      stack: error.stack  // Optionally include the stack trace for deeper insight
    });
  }
};

// Get all equipment items
const getAllEquipment = async (req, res) => {
  try {
    const equipments = await Equipment.find();
    res.status(200).json(equipments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get equipment', error });
  }
};

// Get a single equipment item by ID
const getEquipmentById = async (req, res) => {
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
};

// Update an equipment item
const updateEquipment = async (req, res) => {
  try {
    const updatedEquipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEquipment) {
      res.status(404).json({ message: 'Equipment not found' });
    } else {
      res.status(200).json(updatedEquipment);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update equipment', error });
  }
};

// Delete an equipment item
const deleteEquipment = async (req, res) => {
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
};

module.exports = {
  createEquipment,
  getAllEquipment,
  getEquipmentById,
  updateEquipment,
  deleteEquipment
};
