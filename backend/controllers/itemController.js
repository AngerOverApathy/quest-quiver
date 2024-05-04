const Item = require('../models/itemSchema');

// Create a new item
const createItem = async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error when creating item:", error);
    res.status(400).json({
      message: 'Failed to create new item',
      error: error.message, // Changed this to provide a more explicit message
      stack: error.stack // Optionally include the stack trace for deeper insight
    });
  }
};

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user.id });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get items', error });
  }
};

// Get a single item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.status(200).json(item);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get item', error });
  }
};

// Update an item
const updateItem = async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      res.status(404).json({ message: 'Item not found' });
    } else {
      res.status(200).json(updatedItem);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item', error });
  }
};

// Delete an item
const deleteItem = async (req, res) => {
  try {
    const result = await Item.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(200).json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
};
