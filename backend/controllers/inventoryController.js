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
  // Add to inventory
  async addToInventory(req, res) {
    try {
      const userId = req.user.id;
      const { item } = req.body;

      // Log the received item data
      console.log('Received item:', JSON.stringify(item, null, 2));

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
            equipment_category: item.equipment_category ? item.equipment_category.name : '',
            category_range: item.category_range || '',
            weapon_category: item.weapon_category || '',
            damage: item.damage ? {
              damage_dice: item.damage.damage_dice || '',
              damage_type: {
                name: item.damage.damage_type ? item.damage.damage_type.name : ''
              }
            } : { damage_dice: '', damage_type: { name: '' } },
            two_handed_damage: item.two_handed_damage ? {
              damage_dice: item.two_handed_damage.damage_dice || '',
              damage_type: {
                name: item.two_handed_damage.damage_type ? item.two_handed_damage.damage_type.name : ''
              }
            } : { damage_dice: '', damage_type: { name: '' } },
            range: item.range ? { normal: item.range.normal || null, long: item.range.long || null } : { normal: null, long: null },
            throw_range: item.throw_range ? { normal: item.throw_range.normal || null, long: item.throw_range.long || null } : { normal: null, long: null },
            properties: item.properties ? item.properties.map(prop => ({ name: prop.name || '' })) : [], // Extract only the names, default to empty array if undefined
            cost: item.cost ? { quantity: item.cost.quantity || 0, unit: item.cost.unit || '' } : { quantity: 0, unit: '' },
            weight: item.weight || 0,
            rarity: item.rarity ? item.rarity.name : '',
            requires_attunement: item.requires_attunement || false,
            magical: item.magical || false,
            effects: item.effects ? item.effects.map(effect => ({ name: effect.name || '', description: effect.description || '' })) : [],
            desc: item.desc || []
          });
          // Log the equipment data before saving
          console.log('New equipment to be saved:', JSON.stringify(equipment, null, 2));
          await equipment.save();
          // Log the saved equipment data
          console.log('New equipment saved:', JSON.stringify(equipment, null, 2));
        } else {
          // Log if equipment already exists
          console.log('Existing equipment found:', JSON.stringify(equipment, null, 2));
        }
      } else {
        equipment = new Equipment({
          _id: new mongoose.Types.ObjectId(),
          name: item.name,
          equipment_category: item.equipment_category ? item.equipment_category.name : '',
          category_range: item.category_range || '',
          weapon_category: item.weapon_category || '',
          damage: item.damage ? {
            damage_dice: item.damage.damage_dice || '',
            damage_type: {
              name: item.damage.damage_type ? item.damage.damage_type.name : ''
            }
          } : { damage_dice: '', damage_type: { name: '' } },
          two_handed_damage: item.two_handed_damage ? {
            damage_dice: item.two_handed_damage.damage_dice || '',
            damage_type: {
              name: item.two_handed_damage.damage_type ? item.two_handed_damage.damage_type.name : ''
            }
          } : { damage_dice: '', damage_type: { name: '' } },
          range: item.range ? { normal: item.range.normal || null, long: item.range.long || null } : { normal: null, long: null },
          throw_range: item.throw_range ? { normal: item.throw_range.normal || null, long: item.throw_range.long || null } : { normal: null, long: null },
          properties: item.properties ? item.properties.map(prop => ({ name: prop.name || '' })) : [], // Extract only the names, default to empty array if undefined
          cost: item.cost ? { quantity: item.cost.quantity || 0, unit: item.cost.unit || '' } : { quantity: 0, unit: '' },
          weight: item.weight || 0,
          rarity: item.rarity ? item.rarity.name : '',
          requires_attunement: item.requires_attunement || false,
          magical: item.magical || false,
          effects: item.effects ? item.effects.map(effect => ({ name: effect.name || '', description: effect.description || '' })) : [],
          desc: item.desc || []
        });
        // Log the equipment data before saving
        console.log('New equipment to be saved:', JSON.stringify(equipment, null, 2));
        await equipment.save();
        // Log the saved equipment data
        console.log('New equipment saved:', JSON.stringify(equipment, null, 2));
      }

      // Check if the item already exists in the user's inventory
      let inventoryItem = await UserInventory.findOne({ user: userId, equipmentId: equipment._id });

      if (inventoryItem) {
        // If item exists, update the quantity
        inventoryItem.quantity += item.quantity || 1;
        inventoryItem.customizations = item.customizations || '';
        // Log the updated inventory item data
        console.log('Updated inventory item:', JSON.stringify(inventoryItem, null, 2));
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