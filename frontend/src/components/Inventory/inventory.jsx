import React, { useState, useEffect } from 'react';
import Item from './Item';

function Inventory() {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null); // State for the item being edited
  const [isEditing, setIsEditing] = useState(false); // State for showing the edit form/modal

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/inventory'); 
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };
  
  const handleEdit = (item) => {
    setEditingItem(item); // Set the current item to be edited
    setIsEditing(true); // Show the edit form/modal
  };

  const handleEditSubmit = async (updatedItem) => {
    try {
      const response = await fetch(`/equipment/${updatedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        throw new Error('Failed to update item');
      }
      const data = await response.json();
      setItems(items.map(item => (item._id === data._id ? data : item))); // Update the state with the edited item
      setIsEditing(false); // Close the edit form/modal
      setEditingItem(null); // Clear the editing item state
    } catch (error) {
      console.error('Error updating item:', error);
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
      {isEditing && (
        <EditForm
          item={editingItem}
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}



export default InventoryComponent;


