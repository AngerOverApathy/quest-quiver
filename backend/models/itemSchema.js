const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: [String], default: [] }, // Unified description field

  category_range: { 
    name: { type: String, default: '' } // Standardizing category name field
  },
  
  rarity: { type: String, default: '' }, // Using string directly
  requiresAttunement: { type: Boolean, default: false },

  // Damage attributes using nested sub-documents for types
  damage: {
    damage_dice: { type: String },
    damage_type: { type: String } // Simplified from damage_type: { name: String }
  },

  // Two-handed damage attributes
  two_handed_damage: {
    damage_dice: { type: String },
    damage_type: { type: String } // Simplified from damage_type: { name: String }
  },

  // Unified range attributes, including throwing ranges as nested sub-documents
  range: {
    normal: { type: Number, default: 0 },
    long: { type: Number, default: 0 },
    throw_normal: { type: Number, default: 0 },
    throw_long: { type: Number, default: 0 }
  },

  // Properties, now an array of objects for added flexibility
  properties: [{ 
    name: { type: String },
    details: { type: String, default: '' } // Optional details
  }],

  // Weight and cost as sub-documents
  weight: { type: Number, default: 0 },
  cost: {
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: '' }
  },
  
  // Magical flag and effects as an array for magical items
  magical: { type: Boolean, default: false },
  effects: [{ 
    effectName: { type: String },
    effectDescription: { type: String }
  }]
});

const Equipment = mongoose.model('Equipment', itemSchema);
module.exports = Equipment;
