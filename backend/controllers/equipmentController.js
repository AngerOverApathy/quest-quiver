const axios = require('axios'); // Import Axios
const Equipment = require('../models/equipmentSchema');

const equipmentController = {

    // Fetch data from an external API by index
  async fetchData(req, res) {
    const { index } = req.params; // Get index from the route parameters
    const baseUrl = 'https://www.dnd5eapi.co/api';
    const endpoints = [
      `${baseUrl}/equipment/${index}`,
      `${baseUrl}/magic-items/${index}`,
      `${baseUrl}/weapon-properties/${index}`
    ];

    try {
      console.log(`Fetching data for index: ${index}`); // Log the index being fetched
      const apiRequests = endpoints.map(endpoint => axios.get(endpoint));
      const apiResponses = await Promise.allSettled(apiRequests);

      apiResponses.forEach((response, idx) => {
        console.log(`Response from ${endpoints[idx]}:`, response); // Log each response
      });

      const successfulResponse = apiResponses.find(response => response.status === 'fulfilled');

      if (successfulResponse) {
        console.log('Successful response data:', successfulResponse.value.data); // Log the successful response data
        res.status(200).json(successfulResponse.value.data);
      } else {
        console.log('No successful response found');
        res.status(404).json({ message: 'Item not found' });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: 'Failed to fetch data', error: error.message });
    }
  },

  // Create a new equipment item
  // Create a new equipment item
async createEquipment(req, res) {
  try {
    const {
      name,
      category_range,
      damage,
      two_handed_damage,
      range,
      throw_range,
      properties,
      equipment_category,
      rarity,
      requires_attunement,
      weight,
      cost,
      desc,
      magical,
      effects
    } = req.body;

    // Ensure that the data matches the schema structure
    const newEquipment = new Equipment({
      name,
      category_range,
      damage: {
        damage_dice: damage?.damage_dice || '',
        damage_type: {
          name: damage?.damage_type?.name || ''
        }
      },
      two_handed_damage: {
        damage_dice: two_handed_damage?.damage_dice || '',
        damage_type: {
          name: two_handed_damage?.damage_type?.name || ''
        }
      },
      range: {
        normal: range?.normal || null,
        long: range?.long || null
      },
      throw_range: {
        normal: throw_range?.normal || null,
        long: throw_range?.long || null
      },
      properties: properties ? properties.map(prop => ({ name: prop.name })) : [],
      equipment_category: {
        name: equipment_category?.name || ''
      },
      rarity: {
        name: rarity?.name || ''
      },
      requires_attunement,
      weight,
      cost: {
        quantity: cost?.quantity || 0,
        unit: cost?.unit || ''
      },
      desc,
      magical,
      effects: effects ? effects.map(effect => ({
        effectName: effect.effectName || '',
        effectDescription: effect.effectDescription || ''
      })) : []
    });

    const savedEquipment = await newEquipment.save();
    res.status(201).json(savedEquipment);
  } catch (error) {
    console.error("Error when creating equipment:", error);
    res.status(400).json({
      message: 'Failed to create new equipment',
      error: error.message,
      stack: error.stack
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