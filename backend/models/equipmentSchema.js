const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const equipmentSchema = new Schema({
  name: { type: String, required: true },
  desc: { type: [String], default: [] },

  equipment_category: { 
    name: { type: String, default: '' }
  },
  
  rarity: { type: String, default: '' },
  requiresAttunement: { type: Boolean, default: false },

  damage: {
    damage_dice: { type: String },
    damage_type: { 
      name: { type: String }
    }
  },

  two_handed_damage: {
    damage_dice: { type: String },
    damage_type: {
      name: { type: String }
    }
  },

  range: {
    normal: { type: Number, default: null },
    long: { type: Number, default: null }
  },

  throwRange: {
    normal: { type: Number, default: null },
    long: { type: Number, default: null }
  },

  properties: [{ 
    name: { type: String }
  }],

  weight: { type: Number, default: 0 },
  cost: {
    quantity: { type: Number, default: 0 },
    unit: { type: String, default: '' }
  },
  
  magical: { type: Boolean, default: false },
  effects: [{ 
    effectName: { type: String },
    effectDescription: { type: String }
  }]
});

const Equipment = mongoose.model('Equipment', equipmentSchema);
module.exports = Equipment;
