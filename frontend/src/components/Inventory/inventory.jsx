import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import ItemForm from '../ItemForm/ItemForm';
import Item from '../Item/Item';
import './index.css';
import './ModalStyles.css';

Modal.setAppElement('#root'); // Set the app element for accessibility 

const generateUniqueId = () => {
  return 'id-' + new Date().getTime() + '-' + Math.floor(Math.random() * 1000);
};

function mapFetchedItemToUserItem(item) {
  return {
    name: item.name,
    desc: Array.isArray(item.desc) ? item.desc : [],
    equipmentType: item.equipment_category ? item.equipment_category.name : '',
    equipmentCategory: item.category_range || '',
    weaponCategory: item.weapon_category || '',
    damage: item.damage ? item.damage.damage_dice : '',
    damageType: item.damage ? item.damage.damage_type.name : '',
    range: typeof item.range === 'object' ? {
      normal: item.range.normal || null,
      long: item.range.long || null
    } : { 
      normal: typeof item.range === 'string' ? parseInt(item.range.split(': ')[1]) || null : null,
      long: null 
    },
    throw_range: item.throw_range ? {
      normal: item.throw_range.normal || null,
      long: item.throw_range.long || null
    } : { 
      normal: null, 
      long: null 
    },
    properties: item.properties ? item.properties.map(prop => prop.name) : [],
    cost: item.cost ? {
      quantity: item.cost.quantity || 0,
      unit: item.cost.unit || ''
    } : { 
      quantity: 0, 
      unit: '' 
    },
    weight: item.weight || 0,
    rarity: item.rarity ? item.rarity.name : '',
    acquiredDate: new Date(),
    customizations: '',
    quantity: 1,
    equipmentId: item.index,
    requires_attunement: item.requires_attunement || false,
    magical: item.magical || false,
    effects: item.effects ? item.effects.map(effect => ({
      effectName: effect.effectName || '',
      effectDescription: effect.effectDescription || ''
    })) : []
  };
}

function Inventory() {
  const [items, setItems] = useState([]);
  const [userCreatedItems, setUserCreatedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false); // Modal state

  useEffect(() => {
    console.log('useEffect triggered - fetching user inventory');
    fetchUserInventory();
  }, []);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

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
      console.log('Fetched Inventory:', data); // Log the fetched inventory
      const fetchedItems = data.filter(item => !item.isUserCreated);
      const userCreatedItems = data.filter(item => item.isUserCreated);
  
      setItems(fetchedItems);
      setUserCreatedItems(userCreatedItems);
  
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
      openModal(); // Open the modal when item details are fetched
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
      userItem.customId = item.customId || generateUniqueId(); // Preserve or generate customId
      console.log('User Item to Add:', userItem);
  
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
      console.log('Added item to inventory:', data);
  
      await fetchUserInventory();
  
      setSearchResults([]);
      setSearchQuery('');
      setSelectedItem(null);
      setShowDetails(false);
      setIsEditing(false);
      setIsCreating(false);
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
  
      const newItemWithFlag = { 
        ...newItem, 
        isUserCreated: true,
        customId: generateUniqueId() // Ensure this generates a unique customId
      };
  
      const response = await fetch('http://localhost:5050/equipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newItemWithFlag),
      });
  
      if (!response.ok) {
        throw new Error('Failed to create item');
      }
  
      const data = await response.json();
  
      // Add the new item to the inventory
      await handleAddToInventory(data);
  
      await fetchUserInventory();
  
      setSearchResults([]);
      setSearchQuery('');
      setSelectedItem(null);
      setShowDetails(false);
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
    closeModal(); // Close the modal when canceling
  };

  return (
    <div className="inventory-container">
      <div className='item-bar'>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for equipment"
        />
        <button className='search-btn' onClick={handleSearch}>Search</button>
        <button className='create-btn' onClick={handleCreate}>Create New Item</button>
      </div>

      <div>
        {searchResults.map(item => (
          <div key={item.index}>
            <h4>{item.name}</h4>
            <button onClick={() => fetchItemDetails(item.index)}>View Details</button>
            <button onClick={() => handleAddToInventory(item)}>Add to Inventory</button>
          </div>
        ))}
        {userCreatedItems.map(item => (
          <Item
            key={item._id}
            item={item}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        ))}
      </div>

      {showDetails && selectedItem && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Item Details"
          className="ReactModal__Content"
          overlayClassName="ReactModal__Overlay"
          style={{ content: {}, overlay: {} }} // Disable default inline styles
        >
          <h3><u>Item Details</u></h3>
          <p><b>{selectedItem.name}</b></p>
          {selectedItem.desc && selectedItem.desc.length > 0 && (
            <p>Description: {selectedItem.desc.join(' ')}</p>
          )}
          {selectedItem.equipment_category && selectedItem.equipment_category.name && (
            <p>Equipment Category: {selectedItem.equipment_category.name}</p>
          )}
          {selectedItem.weapon_category && (
            <p>Weapon Category: {selectedItem.weapon_category}</p>
          )}
          {selectedItem.weapon_range && (
            <p>Weapon Range: {selectedItem.weapon_range}</p>
          )}
          {selectedItem.damage && selectedItem.damage.damage_dice && selectedItem.damage.damage_type && (
            <p>Damage: {selectedItem.damage.damage_dice} / {selectedItem.damage.damage_type.name}</p>
          )}
          {selectedItem.two_handed_damage && selectedItem.two_handed_damage.damage_dice && (
            <p>Two-Handed Damage: {selectedItem.two_handed_damage.damage_dice} {selectedItem.two_handed_damage.damage_type.name}</p>
          )}
          {selectedItem.range && selectedItem.range.normal && (
            <p>Range: {selectedItem.range.normal} ft
              {selectedItem.range.long && selectedItem.range.long !== '' ? ` / ${selectedItem.range.long} ft` : ''}
            </p>
          )}
          {selectedItem.throw_range && selectedItem.throw_range.normal && (
            <p>Throw Range: Normal: {selectedItem.throw_range.normal} ft
              {selectedItem.throw_range.long && selectedItem.throw_range.long !== '' ? `, Long: ${selectedItem.throw_range.long} ft` : ''}
            </p>
          )}
          {selectedItem.cost && selectedItem.cost.quantity > 0 && selectedItem.cost.unit && (
            <p>Cost: {selectedItem.cost.quantity} {selectedItem.cost.unit}</p>
          )}
          {selectedItem.properties && selectedItem.properties.length > 0 && selectedItem.properties.some(prop => prop.name) && (
            <p>Properties: {selectedItem.properties.map(prop => prop.name).filter(name => name).join(', ')}</p>
          )}
          {selectedItem.weight && (
            <p>Weight: {selectedItem.weight} lbs</p>
          )}
          {selectedItem.rarity && selectedItem.rarity.name && selectedItem.rarity.name.trim() !== '' && (
            <p>Rarity: {selectedItem.rarity.name}</p>
          )}
          {selectedItem.requires_attunement !== undefined && (
            <p>Requires Attunement: {selectedItem.requires_attunement ? 'Yes' : 'No'}</p>
          )}
          {selectedItem.magical !== undefined && (
            <p>Magical: {selectedItem.magical ? 'Yes' : 'No'}</p>
          )}
          {selectedItem.effects && selectedItem.effects.length > 0 && selectedItem.effects.some(effect => effect.effectName || effect.effectDescription) && (
            <div>
              <strong>Effects:</strong>
              {selectedItem.effects.map((effect, index) => (
                effect && (effect.effectName || effect.effectDescription) && <p key={index}>{effect.effectName}: {effect.effectDescription}</p>
              ))}
            </div>
          )}
          <button onClick={() => handleAddToInventory(selectedItem)}>Add to Inventory</button>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}

      <div className='inventory'>
        <h3>Inventory Items</h3>
        <div className='inventory-list'>
          {items.map(item => (
            <Item
              key={item._id}
              item={item}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {isEditing && (
        <div>
          <h3>{isCreating ? 'Create Item' : 'Edit Item'}</h3>
          <ItemForm
            item={editingItem}
            onSubmit={isCreating ? async (item) => {
              console.log(item)
              await handleCreateSubmit(item); 
              await handleAddToInventory(item)
            } : handleEditSubmit}
            onCancel={handleCancel}
          />
        </div>
      )}
    </div>
  );
}

export default Inventory;
