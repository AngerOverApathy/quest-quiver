const mongoose = require('mongoose');
const Equipment = require('./models/equipmentSchema');

// Replace the URL with the appropriate connection string to your MongoDB instance
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');

  // Create a new equipment item instance
  const testItem = new Equipment({
    name: 'Flaming Sword',
    desc: ['A sword engulfed in magical flames'],
    equipment_category: {
      name: 'Weapon'
    },
    rarity: 'Rare',
    requiresAttunement: true,
    damage: {
      damage_dice: '1d8',
      damage_type: {
        name: 'Fire'
      }
    },
    two_handed_damage: {
      damage_dice: '1d10',
      damage_type: {
        name: 'Fire'
      }
    },
    range: {
      normal: 0,
      long: 0
    },
    throwRange: {
      normal: null,
      long: null
    },
    properties: [{ name: 'Versatile' }],
    weight: 4,
    cost: {
      quantity: 1000,
      unit: 'gp'
    },
    magical: true,
    effects: [
      {
        effectName: 'Flame Burst',
        effectDescription: 'Emits a burst of flames upon command.'
      }
    ]
  });

  // Save the test item to the database
  testItem.save()
    .then(() => {
      console.log('Test item created successfully');
      mongoose.connection.close(); // Close the connection after saving
    })
    .catch((err) => {
      console.error('Error creating test item:', err);
      mongoose.connection.close(); // Close the connection even if there's an error
    });
});
