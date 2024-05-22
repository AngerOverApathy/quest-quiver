import React, { useState, useEffect } from 'react';

function InventoryComponent() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/user/inventory')
      .then(response => response.json())
      .then(data => setItems(data))
      .catch(error => console.error('Error fetching inventory:', error));
  }, []);

  const handleDelete = (itemId) => {
    // API call to delete item
    // On success, remove item from state
  };

  const handleEdit = (itemData) => {
    // Possibly set up state and pass to a form to edit
  };

  return (
    <div>
      {items.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
          <button onClick={() => handleEdit(item)}>Edit</button>
          <button onClick={() => handleDelete(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default InventoryComponent;
