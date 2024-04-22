const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: [String], default: [] }, // Unified description field from fetchedEquipmentSchema 'desc'

  equipment_category: { 
    name: { type: String, default: '' } // Standardizing category name field from fetchedEquipmentSchema
  },
  
  rarity: { type: String, default: '' }, // Using string directly, aligned with the simplicity of fetchedEquipmentSchema

  requiresAttunement: { type: Boolean, default: false }, // Keeping alignment with the fetched schema's boolean flag usage

  // Damage attributes using fetched schema naming conventions
  damage: {
    damage_dice: { type: String },
    damage_type: { 
      name: { type: String } // Using sub-document to match fetched schema structure
    }
  },

  // Two-handed damage attributes
  two_handed_damage: {
    damage_dice: { type: String },
    damage_type: {
      name: { type: String } // Using sub-document to match fetched schema structure
    }
  },

  // Unified range attributes, including throwing ranges as nested sub-documents
  range: {
    normal: { type: Number, default: null },
    long: { type: Number, default: null }
  },

  throwRange: { // Reflecting the same structure as fetched schema
    normal: { type: Number, default: null },
    long: { type: Number, default: null }
  },

  // Properties directly as array of objects from fetched schema
  properties: [{ 
    name: { type: String },
  }],

  // Weight and cost as sub-documents from fetched schema
  weight: { type: Number, default: 0 },
  cost: {
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: '' }
  },
  
  // Magical flag and effects similar structure as seen in the magical items schema
  magical: { type: Boolean, default: false },
  effects: [{ 
    effectName: { type: String },
    effectDescription: { type: String }
  }]
});

const Equipment = mongoose.model('Equipment', itemSchema);
module.exports = Equipment;
