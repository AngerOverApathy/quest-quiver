import React, { useState } from 'react';
import './index.css';

function Item({ item, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  console.log('Item Data:', item)

  // Use equipmentId properties if available
  const equipment = item.equipmentId || {};

  return (
    <div className="item-container">
      <h3>{equipment.name}</h3>
      {equipment.damage && equipment.damage.damage_dice && equipment.damage.damage_type && (
        <p><strong>Damage / Type:</strong> {equipment.damage.damage_dice} / {equipment.damage.damage_type.name}</p>
      )}
      {equipment.two_handed_damage && equipment.two_handed_damage.damage_dice && (
        <p><strong>Two-Handed Damage:</strong> {equipment.two_handed_damage.damage_dice} {equipment.two_handed_damage.damage_type.name}</p>
      )}
      {equipment.range && equipment.range.normal && (
        <p><strong>Range: </strong> 
          {equipment.range.normal} ft
          {equipment.range.long && equipment.range.long !== '' ? ` / ${equipment.range.long} ft` : ''}
        </p>
      )}
      {equipment.throw_range && equipment.throw_range.normal && (
        <p><strong>Throw Range:</strong> Normal: {equipment.throw_range.normal} ft
          {equipment.throw_range.long && equipment.throw_range.long !== '' ? `, Long: ${equipment.throw_range.long} ft` : ''}
        </p>
      )}
      {equipment.desc && equipment.desc.length > 0 && <p>{equipment.desc.join(' ')}</p>}
      {showDetails && (
        <div className='item-details'>
          {equipment.category_range && <p><strong>Category Range:</strong> {equipment.category_range}</p>}
          {equipment.equipment_category && equipment.equipment_category.name && (
            <p><strong>Equipment Category:</strong> {equipment.equipment_category.name}</p>
          )}
          {equipment.weapon_category && <p><strong>Weapon Category:</strong> {equipment.weapon_category}</p>}
          {(equipment.properties && equipment.properties.length > 0 && equipment.properties.some(prop => prop.name)) && (
            <p><strong>Properties:</strong> {equipment.properties.map(prop => prop && prop.name).filter(name => name).join(', ')}</p>
          )}
          {(equipment.cost && equipment.cost.quantity > 0 && equipment.cost.unit) && (
          <p><strong>Cost:</strong> {equipment.cost.quantity} {equipment.cost.unit}</p>
          )}
          {equipment.weight && <p><strong>Weight:</strong> {equipment.weight} lbs</p>}
          {equipment.rarity && equipment.rarity.name && equipment.rarity.name.trim() !== '' && (
            <p><strong>Rarity:</strong> {equipment.rarity.name}</p>
          )}
          {equipment.requires_attunement !== undefined && (
            <p><strong>Requires Attunement:</strong> {equipment.requires_attunement ? 'Yes' : 'No'}</p>
          )}
          {equipment.magical !== undefined && <p><strong>Magical:</strong> {equipment.magical ? 'Yes' : 'No'}</p>}
          {(equipment.effects && equipment.effects.length > 0 && equipment.effects.some(effect => effect.effectName || effect.effectDescription)) && (
          <div>
            <strong>Effects:</strong>
            {equipment.effects.map((effect, index) => (
              effect && (effect.effectName || effect.effectDescription) && <p key={index}>{effect.effectName}: {effect.effectDescription}</p>
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
