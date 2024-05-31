import React from 'react';
import './index.css';

function Item({ item, onDelete, onEdit }) {
  const [showDetails, setShowDetails] = React.useState(false);

  const toggleDetails = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <div className="item-container">
      <h3>{item.name}</h3>
      <p>{item.description}</p>
      {showDetails && (
        <div>
            {/* Equipment Type */}
            {item.equipmentType && <p><strong>Equipment Type:</strong> {item.equipmentType}</p>}

            {/* Equipment Category */}
            {item.equipmentCategory && <p><strong>Equipment Category:</strong> {item.equipmentCategory}</p>}

            {/* Weapon Category */}
            {item.weaponCategory && <p><strong>Weapon Category:</strong> {item.weaponCategory}</p>}

            {/* Damage and Damage Type if both exist */}
            {item.damage && item.damageType && <p><strong>Damage / Type:</strong> {item.damage} / {item.damageType}</p>}

            {/* Two-Handed Damage */}
            {item.twoHandedDamage && <p><strong>Two-Handed Damage:</strong> {item.twoHandedDamage}</p>}

            {/* Range */}
            {item.range && <p><strong>Range:</strong> {item.range}</p>}

            {/* Throw Range if normal and long ranges exist */}
            {item.throwRange && <p><strong>Throw Range:</strong> Normal: {item.throwRange.normal}, Long: {item.throwRange.long}</p>}

            {/* Properties if the array exists and is not empty */}
            {item.properties && item.properties.length > 0 && <p><strong>Properties:</strong> {item.properties.join(', ')}</p>}

            {/* Cost */}
            {item.cost && <p><strong>Cost:</strong> {item.cost.quantity} {item.cost.unit}</p>}

            {/* Weight */}
            {item.weight && <p><strong>Weight:</strong> {item.weight} lbs</p>}

            {/* Description */}
            {item.description && <p><strong>Description:</strong> {item.description}</p>}

            {/* Rarity */}
            {item.rarity && <p><strong>Rarity:</strong> {item.rarity}</p>}
        </div>
      )}
      <button onClick={toggleDetails}>
        {showDetails ? 'Hide Details' : 'See More'}
      </button>
      <button onClick={() => onCreate()}>Create an Item</button>
      <button onClick={() => onEdit(item)}>Edit</button>
      <button onClick={() => onDelete(item._id)}>Delete</button>
    </div>
  );
}

export default Item;
