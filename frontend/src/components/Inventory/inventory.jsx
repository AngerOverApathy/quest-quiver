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


// src/components/Inventory.js
import React, { useState, useEffect } from 'react';
import Item from './Item';
import './index.css';

function Inventory() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    // Replace this with your actual data fetching logic
    // For example, making an API call to fetch items
    try {
      const response = await fetch('/api/items'); // Adjust the URL to your API endpoint
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleEdit = (item) => {
    // Logic to handle editing an item
    console.log('Edit item:', item);
    // You might open a modal or navigate to a different page to edit the item
  };

  const handleDelete = async (itemId) => {
    // Logic to handle deleting an item
    try {
      await fetch(`/api/items/${itemId}`, { method: 'DELETE' }); // Adjust the URL to your API endpoint
      setItems(items.filter(item => item._id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="inventory-container">
      {items.map(item => (
        <Item
          key={item._id}
          item={item}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

export default Inventory;
