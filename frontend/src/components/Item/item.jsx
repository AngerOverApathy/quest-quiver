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
            {/* Conditionally render Equipment Type if it exists */}
            {item.equipmentType && <p><strong>Equipment Type:</strong> {item.equipmentType}</p>}

            {/* Conditionally render Equipment Category if it exists */}
            {item.equipmentCategory && <p><strong>Equipment Category:</strong> {item.equipmentCategory}</p>}

            {/* Conditionally render Weapon Category if it exists */}
            {item.weaponCategory && <p><strong>Weapon Category:</strong> {item.weaponCategory}</p>}

            {/* Conditionally render Damage and Damage Type if both exist */}
            {item.damage && item.damageType && <p><strong>Damage / Type:</strong> {item.damage} / {item.damageType}</p>}

            {/* Conditionally render Two-Handed Damage if it exists */}
            {item.twoHandedDamage && <p><strong>Two-Handed Damage:</strong> {item.twoHandedDamage}</p>}

            {/* Conditionally render Range if it exists */}
            {item.range && <p><strong>Range:</strong> {item.range}</p>}

            {/* Conditionally render Throw Range if normal and long ranges exist */}
            {item.throwRange && <p><strong>Throw Range:</strong> Normal: {item.throwRange.normal}, Long: {item.throwRange.long}</p>}

            {/* Conditionally render Properties if the array exists and is not empty */}
            {item.properties && item.properties.length > 0 && <p><strong>Properties:</strong> {item.properties.join(', ')}</p>}

            {/* Conditionally render Cost if it exists */}
            {item.cost && <p><strong>Cost:</strong> {item.cost.quantity} {item.cost.unit}</p>}

            {/* Conditionally render Weight if it exists */}
            {item.weight && <p><strong>Weight:</strong> {item.weight} lbs</p>}

            {/* Conditionally render Description if it exists */}
            {item.description && <p><strong>Description:</strong> {item.description}</p>}

            {/* Conditionally render Rarity if it exists */}
            {item.rarity && <p><strong>Rarity:</strong> {item.rarity}</p>}
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
