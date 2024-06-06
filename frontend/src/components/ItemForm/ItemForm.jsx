import React, { useState, useEffect } from 'react';

function ItemForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category_range: '',
    damage: { damage_dice: '', damage_type: { name: '' } },
    two_handed_damage: { damage_dice: '', damage_type: { name: '' } },
    range: { normal: '', long: '' },
    throw_range: { normal: '', long: '' },
    properties: [{ name: '' }],
    equipment_category: { name: '' },
    rarity: { name: '' },
    requires_attunement: false,
    weight: 0,
    cost: { quantity: 0, unit: '' },
    desc: [],
    magical: false,
    effects: [{ effectName: '', effectDescription: '' }]
  });

  useEffect(() => {
    if (item) {
      setFormData({
        ...item,
        damage: item.damage || { damage_dice: '', damage_type: { name: '' } },
        two_handed_damage: item.two_handed_damage || { damage_dice: '', damage_type: { name: '' } },
        range: item.range || { normal: '', long: '' },
        throw_range: item.throw_range || { normal: '', long: '' },
        properties: item.properties.length ? item.properties : [{ name: '' }],
        equipment_category: item.equipment_category || { name: '' },
        rarity: item.rarity || { name: '' },
        cost: item.cost || { quantity: 0, unit: '' },
        effects: item.effects.length ? item.effects : [{ effectName: '', effectDescription: '' }],
        requires_attunement: item.requires_attunement || false,
        magical: item.magical || false
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: val
    }));
  };

  const handleNestedChange = (e, field, subField) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [subField || name]: value
      }
    }));
  };

  const handleArrayChange = (e, index, field) => {
    const { name, value } = e.target;
    const updatedArray = [...formData[field]];
    updatedArray[index][name] = value;
    setFormData((prevData) => ({
      ...prevData,
      [field]: updatedArray
    }));
  };

  const handleAddProperty = () => {
    setFormData((prevData) => ({
      ...prevData,
      properties: [...prevData.properties, { name: '' }]
    }));
  };

  const handleAddEffect = () => {
    setFormData((prevData) => ({
      ...prevData,
      effects: [...prevData.effects, { effectName: '', effectDescription: '' }]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category Range</label>
        <input
          type="text"
          name="category_range"
          value={formData.category_range}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Damage</label>
        <input
          type="text"
          name="damage_dice"
          value={formData.damage.damage_dice}
          onChange={(e) => handleNestedChange(e, 'damage')}
        />
        <input
          type="text"
          name="name"
          placeholder="Damage Type"
          value={formData.damage.damage_type.name}
          onChange={(e) => handleNestedChange(e, 'damage', 'damage_type')}
        />
      </div>
      <div>
        <label>Two-Handed Damage</label>
        <input
          type="text"
          name="damage_dice"
          value={formData.two_handed_damage.damage_dice}
          onChange={(e) => handleNestedChange(e, 'two_handed_damage')}
        />
        <input
          type="text"
          name="name"
          placeholder="Damage Type"
          value={formData.two_handed_damage.damage_type.name}
          onChange={(e) => handleNestedChange(e, 'two_handed_damage', 'damage_type')}
        />
      </div>
      <div>
        <label>Range</label>
        <input
          type="number"
          name="normal"
          placeholder="Normal Range"
          value={formData.range.normal}
          onChange={(e) => handleNestedChange(e, 'range')}
        />
        <input
          type="number"
          name="long"
          placeholder="Long Range"
          value={formData.range.long}
          onChange={(e) => handleNestedChange(e, 'range')}
        />
      </div>
      <div>
        <label>Throw Range</label>
        <input
          type="number"
          name="normal"
          placeholder="Normal Throw Range"
          value={formData.throw_range.normal}
          onChange={(e) => handleNestedChange(e, 'throw_range')}
        />
        <input
          type="number"
          name="long"
          placeholder="Long Throw Range"
          value={formData.throw_range.long}
          onChange={(e) => handleNestedChange(e, 'throw_range')}
        />
      </div>
      <div>
        <label>Properties</label>
        {formData.properties.map((property, index) => (
          <input
            key={index}
            type="text"
            name="name"
            placeholder="Property"
            value={property.name}
            onChange={(e) => handleArrayChange(e, index, 'properties')}
          />
        ))}
        <button type="button" onClick={handleAddProperty}>Add Property</button>
      </div>
      <div>
        <label>Equipment Category</label>
        <input
          type="text"
          name="name"
          value={formData.equipment_category.name}
          onChange={(e) => handleNestedChange(e, 'equipment_category')}
        />
      </div>
      <div>
        <label>Rarity</label>
        <input
          type="text"
          name="name"
          value={formData.rarity.name}
          onChange={(e) => handleNestedChange(e, 'rarity')}
        />
      </div>
      <div>
        <label>Requires Attunement</label>
        <input
          type="checkbox"
          name="requires_attunement"
          checked={formData.requires_attunement}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Weight</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Cost</label>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.cost.quantity}
          onChange={(e) => handleNestedChange(e, 'cost')}
        />
        <input
          type="text"
          name="unit"
          placeholder="Unit"
          value={formData.cost.unit}
          onChange={(e) => handleNestedChange(e, 'cost')}
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          name="desc"
          value={formData.desc.join('\n')}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value.split('\n') })}
        />
      </div>
      <div>
        <label>Magical</label>
        <input
          type="checkbox"
          name="magical"
          checked={formData.magical}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Effects</label>
        {formData.effects.map((effect, index) => (
          <div key={index}>
            <input
              type="text"
              name="effectName"
              placeholder="Effect Name"
              value={effect.effectName}
              onChange={(e) => handleArrayChange(e, index, 'effects')}
            />
            <textarea
              name="effectDescription"
              placeholder="Effect Description"
              value={effect.effectDescription}
              onChange={(e) => handleArrayChange(e, index, 'effects')}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddEffect}>Add Effect</button>
      </div>
      <div>
        <button type="submit">{item ? 'Update' : 'Create'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default ItemForm;
