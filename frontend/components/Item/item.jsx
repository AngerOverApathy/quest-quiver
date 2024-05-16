import React from 'react';

function Item({ item, onDelete, onEdit }) {
  // Optional: State to toggle more details
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
          <p>Category: {item.category}</p>
          <p>Rarity: {item.rarity}</p>
          <p>Weight: {item.weight} lbs</p>
          {/* Add other properties as needed */}
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
