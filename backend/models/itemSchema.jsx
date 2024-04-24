const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: [String], default: [] },  // Array of strings for multiline descriptions
  equipment_category: { 
    name: { type: String, default: '' }          // Using a sub-document for category details
  },
  rarity: { type: String, default: '' },         // Rarity as a simple string
  requiresAttunement: { type: Boolean, default: false },

  // Damage attributes
  damage: {
    dice: String,
    type: String,
    two_handed_dice: String,
    two_handed_type: String
  },

  // Range attributes, simplified and unified
  range: {
    normal: Number,
    long: Number,
    throw_normal: Number,
    throw_long: Number
  },

  // Properties as an array of strings or objects, based on complexity
  properties: [{ 
    name: String, 
    details: String                               // Optional details if needed
  }],

  // Weight and cost combined into sub-documents for clarity
  weight: { type: Number, default: 0 },
  cost: {
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: '' }
  },
  
  // Additional attributes for magic items if applicable
  magical: { type: Boolean, default: false },    // Flag to indicate if an item is magical
  effects: [{                                    // Effects only for magical items
    effectName: String,
    effectDescription: String
  }]
});

const Equipment = mongoose.model('Equipment', itemSchema);
module.exports = Equipment;