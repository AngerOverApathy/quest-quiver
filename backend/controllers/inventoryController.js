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

      let equipment;
      if (item.index) {
        const itemIndex = item.index;
        if (!itemIndex) {
          throw new Error('Item index is missing');
        }

        equipment = await Equipment.findOne({ index: itemIndex });
        if (!equipment) {
          equipment = new Equipment({
            index: itemIndex,
            name: item.name,
            equipment_category: item.equipment_category,
            category_range: item.category_range,
            weapon_category: item.weapon_category,
            damage: item.damage,
            two_handed_damage: item.two_handed_damage,
            range: item.range,
            throw_range: item.throw_range,
            properties: item.properties.map(prop => prop.name),  // Extract only the names
            cost: item.cost,
            weight: item.weight,
            rarity: item.rarity,
            requires_attunement: item.requires_attunement,
            magical: item.magical,
            effects: item.effects,
            desc: item.desc
          });
          await equipment.save();
        }
      } else {
        equipment = new Equipment({
          _id: new mongoose.Types.ObjectId(),
          name: item.name,
          equipment_category: item.equipment_category,
          category_range: item.category_range,
          weapon_category: item.weapon_category,
          damage: item.damage,
          two_handed_damage: item.two_handed_damage,
          range: item.range,
          throw_range: item.throw_range,
          properties: item.properties.map(prop => prop.name),  // Extract only the names
          cost: item.cost,
          weight: item.weight,
          rarity: item.rarity,
          requires_attunement: item.requires_attunement,
          magical: item.magical,
          effects: item.effects,
          desc: item.desc
        });
        await equipment.save();
      }

      const newItem = new UserInventory({
        user: userId,
        equipmentId: equipment._id,
        quantity: item.quantity || 1,
        customizations: item.customizations || '',
        acquiredDate: new Date()
      });

      const savedItem = await newItem.save();
      console.log('Saved item to inventory:', JSON.stringify(savedItem, null, 2)); // Log the saved item object
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