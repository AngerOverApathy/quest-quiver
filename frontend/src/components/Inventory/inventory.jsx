import React, { useState, useEffect } from 'react';
import ItemForm from '../ItemForm/ItemForm';
import Item from '../Item/Item';
import './index.css';

function mapFetchedItemToUserItem(item) {
  return {
    name: item.name,
    description: item.desc ? item.desc.join(' ') : '',
    equipmentType: item.equipment_category ? item.equipment_category.name : '',
    equipmentCategory: item.category_range || '',
    weaponCategory: item.weapon_category || '',
    damage: item.damage ? item.damage.damage_dice : '',
    damageType: item.damage ? item.damage.damage_type.name : '',
    range: item.range ? `Normal: ${item.range.normal}` : '',
    properties: item.properties ? item.properties.map(prop => prop.name) : [],  // Extract only the names
    cost: item.cost,
    weight: item.weight,
    rarity: item.rarity ? item.rarity.name : '',
    acquiredDate: new Date(),
    customizations: '',
    quantity: 1,
    equipmentId: item.index
  };
}

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
      setItems(data);
    } catch (error) {
      console.error('Error fetching user inventory:', error);
    }
  };

  const fetchItemDetails = async (index) => {
    try {
      const url = `http://localhost:5050/equipment/fetch/${index}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch item details');
      }
      const data = await response.json();
      setSelectedItem(data);
      setShowDetails(true);
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
  
      const userItem = mapFetchedItemToUserItem(item);
  
      const response = await fetch('http://localhost:5050/inventory/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ item: userItem }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add item to inventory');
      }
  
      const data = await response.json();
      console.log('Added item to inventory:', data); // Log the added item
  
      // Refetch the inventory to update the UI
      await fetchUserInventory();
  
      // Clear search results, query, and item details view
      setSearchResults([]);
      setSearchQuery('');
      setSelectedItem(null);
      setShowDetails(false);
    } catch (error) {
      console.error('Error adding item to inventory:', error);
    }
  };

  const handleCreateSubmit = async (newItem) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      const response = await fetch('http://localhost:5050/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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

  const handleEditSubmit = async (updatedItem) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
  
      console.log('Updated item before submission:', updatedItem);
  
      const equipmentId = updatedItem.equipmentId._id || updatedItem.equipmentId;
      console.log('Equipment ID being used:', equipmentId);
  
      const response = await fetch(`http://localhost:5050/equipment/${equipmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedItem)
      });
  
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Error details:', errorDetails);
        throw new Error('Failed to update item');
      }
  
      const data = await response.json();
  
      console.log('Updated data:', data);
  
      // Update the state with the updated item
      setItems(items.map(item => (item.equipmentId._id === data._id ? { ...item, equipmentId: data } : item)));
      setIsEditing(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };
    

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5050/inventory/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
      } else {
        console.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditing(true);
    setIsCreating(false);
    setSelectedItem(null);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setIsCreating(true);
    setIsEditing(true);
    setSelectedItem(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setEditingItem(null);
    setSelectedItem(null);
    setShowDetails(false);
  };

  return (
    <div className="inventory-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for equipment"
      />
      <button onClick={handleSearch}>Search</button>

      <button onClick={handleCreate}>Create New Item</button>

      <div>
        <h3>Search Results</h3>
        {searchResults.map(item => (
          <div key={item.index}>
            <h4>{item.name}</h4>
            <button onClick={() => fetchItemDetails(item.index)}>View Details</button>
            <button onClick={() => handleAddToInventory(item)}>Add to Inventory</button>
          </div>
        ))}
      </div>

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
          <button onClick={() => handleAddToInventory(selectedItem)}>Add to Inventory</button>
        </div>
      )}

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
