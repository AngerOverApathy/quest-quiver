import React, { useState } from 'react';

function Inventory() {
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const fetchItemDetails = async (index) => {
    try {
      const url = `http://localhost:5050/equipment/fetch/${index}`;
      console.log(`Fetching details from URL: ${url}`);
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      console.log(`Response: ${response.status} ${response.statusText}`);
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const data = await response.json();
      console.log('Fetched item details:', data);
      setSelectedItem(data);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const handleSearch = async () => {
    try {
      await fetchItemDetails(searchQuery);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setIsEditing(true);
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
      setItems(items.map(item => (item._id === data._id ? data : item)));
      setIsEditing(false);
      setEditingItem(null);
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
      setItems([...items, data]);
      setIsEditing(false);
      setIsCreating(false);
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
      setItems(items.filter(item => item._id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="inventory-container">
      <button onClick={handleCreate}>Create New Item</button>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for equipment"
      />
      <button onClick={handleSearch}>Search</button>
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
          <p>Description: {selectedItem.desc?.join(', ')}</p>
        </div>
      )}
      <div>
        <h3>Inventory Items</h3>
        {items.map(item => (
          <div key={item._id}>
            <h4>{item.name}</h4>
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </div>
        ))}
      </div>
      {isEditing && (
        <div>
          <h3>Edit Item</h3>
          {/* <EditForm
            item={editingItem}
            onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit}
            onCancel={() => {
              setIsEditing(false);
              setIsCreating(false);
            }}
          /> */}
        </div>
      )}
    </div>
  );
}

export default Inventory;
