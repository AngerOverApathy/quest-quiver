const UserInventory = require('../models/userInventorySchema');
const Equipment = require('../models/equipmentSchema');
const mongoose = require('mongoose');

const inventoryController = {
  // Fetch all inventory items for the logged-in user
  async getUserInventory(req, res) {
    try {
      const userId = req.user.id;
      const userInventory = await UserInventory.findOne({ user: userId }).populate('items.equipmentId');
      res.status(200).json(userInventory ? userInventory.items : []);
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

      // Find or create the equipment
      let equipment = await Equipment.findOne({ index: item.index });
      if (!equipment) {
        equipment = new Equipment({
          index: item.index,
          name: item.name,
          equipment_category: item.equipment_category,
          category_range: item.category_range,
          weapon_category: item.weapon_category,
          damage: item.damage || { damage_dice: '', damage_type: { name: '' } },
          two_handed_damage: item.two_handed_damage || { damage_dice: '', damage_type: { name: '' } },
          range: item.range || { normal: null, long: null },
          throw_range: item.throw_range || { normal: null, long: null },
          properties: item.properties.map(prop => prop.name),
          cost: item.cost,
          weight: item.weight,
          rarity: item.rarity,
          requires_attunement: item.requires_attunement,
          magical: item.magical,
          effects: item.effects || [],
          desc: item.desc || []
        });
        await equipment.save();
      }

      // Find the user's inventory
      let userInventory = await UserInventory.findOne({ user: userId });

      if (userInventory) {
        // Add the new item to the existing inventory
        userInventory.items.push({
          equipmentId: equipment._id,
          quantity: item.quantity || 1,
          customizations: item.customizations || '',
          acquiredDate: new Date()
        });
      } else {
        // Create a new inventory for the user
        userInventory = new UserInventory({
          user: userId,
          items: [{
            equipmentId: equipment._id,
            quantity: item.quantity || 1,
            customizations: item.customizations || '',
            acquiredDate: new Date()
          }]
        });
      }

      await userInventory.save();
      res.status(201).json(userInventory.items);
    } catch (error) {
      console.error("Error adding item to inventory:", error);
      res.status(500).json({ message: "Failed to add item to inventory", error: error.message });
    }
  },

  // Update an inventory item
  async updateInventoryItem(req, res) {
    try {
      const userId = req.user.id;
      const { itemId, quantity, customizations } = req.body;

      // Find the user's inventory
      const userInventory = await UserInventory.findOne({ user: userId });
      if (!userInventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find the item in the inventory and update it
      const item = userInventory.items.id(itemId);
      if (item) {
        item.quantity = quantity;
        item.customizations = customizations;
      } else {
        return res.status(404).json({ message: 'Item not found in inventory' });
      }

      await userInventory.save();
      res.status(200).json(item);
    } catch (error) {
      console.error("Error updating inventory item:", error);
      res.status(400).json({ message: "Failed to update inventory item", error: error.message });
    }
  },

  // Delete an inventory item
  async deleteInventoryItem(req, res) {
    try {
      const userId = req.user.id;
      const { itemId } = req.params;

      // Find the user's inventory
      const userInventory = await UserInventory.findOne({ user: userId });
      if (!userInventory) {
        return res.status(404).json({ message: 'Inventory not found' });
      }

      // Find the item in the inventory and remove it
      const item = userInventory.items.id(itemId);
      if (item) {
        item.remove();
      } else {
        return res.status(404).json({ message: 'Item not found in inventory' });
      }

      await userInventory.save();
      res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
      res.status(500).json({ message: "Failed to delete inventory item", error: error.message });
    }
  }
};

module.exports = inventoryController;
