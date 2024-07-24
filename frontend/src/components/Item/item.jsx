import React, { useState } from 'react';
import './index.css';

function Item({ item, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  // Use equipmentId properties if available
  const equipment = item.equipmentId || {};

  return (
    <div className="item-container">
      <h3>{equipment.name}</h3>
      {equipment.desc && equipment.desc.length > 0 && <p>{equipment.desc.join(' ')}</p>}
      {showDetails && (
        <div className='item-details'>
          {equipment.category_range && <p><strong>Category Range:</strong> {equipment.category_range}</p>}
          {equipment.equipment_category && equipment.equipment_category.name && (
            <p><strong>Equipment Category:</strong> {equipment.equipment_category.name}</p>
          )}
          {equipment.weapon_category && <p><strong>Weapon Category:</strong> {equipment.weapon_category}</p>}
          {equipment.damage && equipment.damage.damage_dice && equipment.damage.damage_type && (
            <p><strong>Damage / Type:</strong> {equipment.damage.damage_dice} / {equipment.damage.damage_type.name}</p>
          )}
          {equipment.two_handed_damage && equipment.two_handed_damage.damage_dice && (
            <p><strong>Two-Handed Damage:</strong> {equipment.two_handed_damage.damage_dice} {equipment.two_handed_damage.damage_type.name}</p>
          )}
          {equipment.range && <p><strong>Range:</strong> {equipment.range.normal} / {equipment.range.long}</p>}
          {equipment.throw_range && equipment.throw_range.normal && equipment.throw_range.long && (
            <p><strong>Throw Range:</strong> Normal: {equipment.throw_range.normal}, Long: {equipment.throw_range.long}</p>
          )}
          {equipment.properties && equipment.properties.length > 0 && (
            <p><strong>Properties:</strong> {equipment.properties.map(prop => prop && prop.name).join(', ')}</p>
          )}
          {equipment.cost && <p><strong>Cost:</strong> {equipment.cost.quantity} {equipment.cost.unit}</p>}
          {equipment.weight && <p><strong>Weight:</strong> {equipment.weight} lbs</p>}
          {equipment.rarity && equipment.rarity.name && <p><strong>Rarity:</strong> {equipment.rarity.name}</p>}
          {equipment.requires_attunement !== undefined && (
            <p><strong>Requires Attunement:</strong> {equipment.requires_attunement ? 'Yes' : 'No'}</p>
          )}
          {equipment.magical !== undefined && <p><strong>Magical:</strong> {equipment.magical ? 'Yes' : 'No'}</p>}
          {equipment.effects && equipment.effects.length > 0 && (
            <div>
              <strong>Effects:</strong>
              {equipment.effects.map((effect, index) => (
                effect && <p key={index}>{effect.effectName}: {effect.effectDescription}</p>
              ))}
            </div>
          )}
        </div>
      )}
      <div className="item-buttons">
        <button onClick={toggleDetails}>
          {showDetails ? 'Hide Details' : 'See More'}
        </button>
        <button onClick={() => onEdit(item)}>Edit</button>
        <button onClick={() => onDelete(item._id)}>Delete</button>
      </div>
    </div>
  );
}

export default Item;
