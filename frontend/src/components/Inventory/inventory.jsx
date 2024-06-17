import React, { useState, useEffect } from 'react';
import ItemForm from '../ItemForm/ItemForm';
import Item from '../Item/Item';

const mapFetchedItemToUserItem = (fetchedItem) => {
  return {
    name: fetchedItem.name,
    description: fetchedItem.desc.join(' '), // Assuming desc is an array
    equipmentType: fetchedItem.equipment_category.name,
    equipmentCategory: fetchedItem.category_range,
    weaponCategory: fetchedItem.weapon_category,
    damage: fetchedItem.damage ? fetchedItem.damage.damage_dice : '',
    damageType: fetchedItem.damage ? fetchedItem.damage.damage_type.name : '',
    range: fetchedItem.range ? `Normal: ${fetchedItem.range.normal}` : '',
    properties: fetchedItem.properties.map(prop => prop.name),
    cost: fetchedItem.cost,
    weight: fetchedItem.weight,
    rarity: fetchedItem.rarity || '', // Assuming rarity might be present
    acquiredDate: new Date(), // Default to current date
    customizations: '', // Default to empty string
    quantity: 1, // Default to 1
    equipmentId: fetchedItem.index // Use a valid identifier from the fetched item
  };
};

function Inventory() {
  const [items, setItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.log('useEffect triggered - fetching user inventory');
    fetchUserInventory();
  }, []); // Empty dependency array ensures this runs once on mount

  const fetchUserInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await fetch('http://localhost:5050/inventory', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user inventory');
      }

      const data = await response.json();
      console.log('Fetched user inventory:', data);
      setItems(data);
    } catch (error) {
      console.error('Error fetching user inventory:', error);
    }
  };

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
      setSelectedItem(data); // Set the selected item with the fetched data
      setShowDetails(true);  // Show the details
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

  const handleAddToInventory = async (item) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      // Map the fetched item to the user item structure
      const userItem = mapFetchedItemToUserItem(item);
      console.log('Mapped user item:', userItem); // Log the mapped item
  
      if (!userItem.equipmentId) {
        throw new Error('Invalid equipmentId');
      }
  
      const response = await fetch('http://localhost:5050/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userItem), // Directly send the mapped item
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item to inventory');
      }
  
      const data = await response.json();
      setItems([...items, data]);
    } catch (error) {
      console.error('Error adding item to inventory:', error);
    }
  };
    
  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditing(true);
    setIsCreating(false);
    setSelectedItem(null); // Reset selectedItem
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setIsEditing(true);
    setSelectedItem(null); // Reset selectedItem
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

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingItem(null);
    setSelectedItem(null);
    setShowDetails(false); // Hide the details
  };

  return (
    <div className="inventory-container">
      {/* Button to create a new item */}
      <button onClick={handleCreate}>Create New Item</button>

      {/* Search input and button */}
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for equipment"
      />
      <button onClick={handleSearch}>Search</button>

      {/* Display search results */}
      <div>
        <h3>Search Results</h3>
        {searchResults.map(item => (
          <div key={item.index}>
            <h4>{item.name}</h4>
            <button onClick={() => fetchItemDetails(item.index)}>View Details</button>
            <button onClick={() => handleAddToInventory(item)}>Add to Inventory</button> {/* Add to Inventory Button */}
          </div>
        ))}
      </div>

      {/* Display details of the selected item */}
      {showDetails && selectedItem && (
        <div>
          <h3>Item Details</h3>
          <p>Name: {selectedItem.name}</p>
          {selectedItem.desc && selectedItem.desc.length > 0 && (
            <p>Description: {selectedItem.desc.join(', ')}</p>
          )}
          {selectedItem.equipment_category && (
            <p>Equipment Category: {selectedItem.equipment_category.name}</p>
          )}
          {selectedItem.weapon_category && (
            <p>Weapon Category: {selectedItem.weapon_category}</p>
          )}
          {selectedItem.weapon_range && (
            <p>Weapon Range: {selectedItem.weapon_range}</p>
          )}
          {selectedItem.cost && selectedItem.cost.quantity && selectedItem.cost.unit && (
            <p>Cost: {selectedItem.cost.quantity} {selectedItem.cost.unit}</p>
          )}
          {selectedItem.damage && selectedItem.damage.damage_dice && selectedItem.damage.damage_type && (
            <p>Damage: {selectedItem.damage.damage_dice} {selectedItem.damage.damage_type.name}</p>
          )}
          {selectedItem.weight && (
            <p>Weight: {selectedItem.weight}</p>
          )}
          {selectedItem.properties && selectedItem.properties.length > 0 && (
            <p>Properties: {selectedItem.properties.map(prop => prop.name).join(', ')}</p>
          )}
          <button onClick={() => handleAddToInventory(selectedItem)}>Add to Inventory</button> {/* Add to Inventory Button */}
        </div>
      )}

      {/* Display list of inventory items */}
      <div>
        <h3>Inventory Items</h3>
        {items.map(item => (
          <Item
            key={item._id}
            item={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {/* Display the form for editing or creating an item */}
      {isEditing && (
        <div>
          <h3>{isCreating ? 'Create Item' : 'Edit Item'}</h3>
          <ItemForm
            item={editingItem}
            onSubmit={isCreating ? handleCreateSubmit : handleEditSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}

export default Inventory;
