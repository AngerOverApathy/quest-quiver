import React, { useState, useEffect } from 'react';
import './index.css';

function Item({ item, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.log('Item details:', item);
  }, [item]);

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <div className="item-container">
      <h3>{item.name}</h3>
      {item.description && <p>{item.description}</p>}
      {showDetails && (
        <div>
          {item.equipmentType && <p><strong>Equipment Type:</strong> {item.equipmentType}</p>}
          {item.equipmentCategory && <p><strong>Equipment Category:</strong> {item.equipmentCategory}</p>}
          {item.weaponCategory && <p><strong>Weapon Category:</strong> {item.weaponCategory}</p>}
          {item.damage && item.damageType && <p><strong>Damage / Type:</strong> {item.damage} / {item.damageType}</p>}
          {item.twoHandedDamage && item.twoHandedDamage.damage_dice && (
            <p><strong>Two-Handed Damage:</strong> {item.twoHandedDamage.damage_dice} {item.twoHandedDamage.damage_type.name}</p>
          )}
          {item.range && <p><strong>Range:</strong> {item.range.normal} / {item.range.long}</p>}
          {item.throwRange && item.throwRange.normal && item.throwRange.long && (
            <p><strong>Throw Range:</strong> Normal: {item.throwRange.normal}, Long: {item.throwRange.long}</p>
          )}
          {item.properties && item.properties.length > 0 && (
            <p><strong>Properties:</strong> {item.properties.map(prop => prop.name).join(', ')}</p>
          )}
          {item.cost && <p><strong>Cost:</strong> {item.cost.quantity} {item.cost.unit}</p>}
          {item.weight && <p><strong>Weight:</strong> {item.weight} lbs</p>}
          {item.rarity && item.rarity.name && <p><strong>Rarity:</strong> {item.rarity.name}</p>}
          {item.requiresAttunement !== undefined && <p><strong>Requires Attunement:</strong> {item.requiresAttunement ? 'Yes' : 'No'}</p>}
          {item.magical !== undefined && <p><strong>Magical:</strong> {item.magical ? 'Yes' : 'No'}</p>}
          {item.effects && item.effects.length > 0 && (
            <div>
              <strong>Effects:</strong>
              {item.effects.map((effect, index) => (
                <p key={index}>{effect.effectName}: {effect.effectDescription}</p>
              ))}
            </div>
          )}
        </div>
      )}
      <button onClick={toggleDetails}>
        {showDetails ? 'Hide Details' : 'See More'}
      </button>
      <button onClick={() => onEdit(item)}>Edit</button>
      <button onClick={() => onDelete(item._id)}>Delete</button>
    </div>
  );
}

export default Item;