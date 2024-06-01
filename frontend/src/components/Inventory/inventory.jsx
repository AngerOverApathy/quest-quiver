import React, { useState, useEffect } from 'react';
import Item from './Item';
//import EditForm from './EditForm'; // Assuming you have created this component

function Inventory() {
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null); // State for the item being edited
  const [isEditing, setIsEditing] = useState(false); // State for showing the edit form/modal
  const [isCreating, setIsCreating] = useState(false); // State for creating a new item

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
    setIsCreating(false); // Ensure we're not in creating mode
  };

  const handleCreate = () => {
    setEditingItem(null); // Clear any existing editing item
    setIsCreating(true);
    setIsEditing(true); // Use the same form for creating
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

  const handleCreateSubmit = async (newItem) => {
    try {
      const response = await fetch('/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error('Failed to create item');
      }
      const data = await response.json();
      setItems([...items, data]); // Add the new item to the state
      setIsEditing(false); // Close the edit form/modal
      setIsCreating(false); // Close the create form/modal
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/equipment/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      setItems(items.filter(item => item._id !== id)); // Remove the item from the state
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`/equipment/search?name=${searchQuery}`); // Call your backend endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch search results');
      }
      const data = await response.json();
      setSearchResults(data.results); // Adjust based on response structure
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const fetchItemDetails = async (index) => {
    try {
      const response = await fetch(`/equipment/fetch/${index}`); // Call your backend endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const data = await response.json();
      setSelectedItem(data); // Store the selected item details
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  return (
    <div className="inventory-container">
      <button onClick={handleCreate}>Create New Item</button>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update the search query state with user input
        placeholder="Search for equipment"
      />
      <button onClick={handleSearch}>Search</button> {/* Call handleSearch when the button is clicked */}
      <div>
        <h3>Search Results</h3>
        {searchResults.map(item => (
          <div key={item.index}>
            <h4>{item.name}</h4>
            <button onClick={() => fetchItemDetails(item.index)}>View Details</button>
          </div>
        ))}
      </div>
      {selectedItem && (
        <div>
          <h3>Item Details</h3>
          <p>Name: {selectedItem.name}</p>
          <p>Description: {selectedItem.desc}</p>
          <button onClick={() => /* logic to add item to inventory */}>Add to Inventory</button>
        </div>
      )}
      <div>
        <h3>Inventory Items</h3>
        {items.map(item => (
          <Item
            key={item._id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      {isEditing && (
        <EditForm
          item={editingItem}
          onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit}
          onCancel={() => {
            setIsEditing(false);
            setIsCreating(false);
          }}
        />
      )}
    </div>
  );
}

export default Inventory;