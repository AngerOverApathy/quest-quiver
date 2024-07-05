const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInventorySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, // Ensure each user has one inventory
  items: [{
    equipmentId: { type: Schema.Types.ObjectId, ref: 'Equipment', required: true },
    quantity: { type: Number, default: 1 },
    customizations: { type: String, default: '' },
    acquiredDate: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

const UserInventory = mongoose.model('UserInventory', userInventorySchema);
module.exports = UserInventory;