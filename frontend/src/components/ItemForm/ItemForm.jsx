import React, { useState, useEffect } from 'react';

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_range: '',
    damage: { damage_dice: '', damage_type: { name: '' } },
    two_handed_damage: { damage_dice: '', damage_type: { name: '' } },
    range: { normal: null, long: null },
    throw_range: { normal: null, long: null },
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
      setFormData(item);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (e, field, nestedField) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      [field]: {
        ...formData[field],
        [nestedField]: value
      }
    });
  };

  const handleArrayChange = (e, field, index, nestedField) => {
    const { value } = e.target;
    const updatedArray = formData[field].map((item, i) => (
      i === index ? { ...item, [nestedField]: value } : item
    ));
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
      </label>
      <label>
        Category Range:
        <input type="text" name="category_range" value={formData.category_range} onChange={handleChange} />
      </label>
      <label>
        Damage Dice:
        <input type="text" name="damage_dice" value={formData.damage.damage_dice} onChange={(e) => handleNestedChange(e, 'damage', 'damage_dice')} />
      </label>
      <label>
        Damage Type:
        <input type="text" name="damage_type" value={formData.damage.damage_type.name} onChange={(e) => handleNestedChange(e, 'damage', 'damage_type.name')} />
      </label>
      <label>
        Two-Handed Damage Dice:
        <input type="text" name="two_handed_damage_dice" value={formData.two_handed_damage.damage_dice} onChange={(e) => handleNestedChange(e, 'two_handed_damage', 'damage_dice')} />
      </label>
      <label>
        Two-Handed Damage Type:
        <input type="text" name="two_handed_damage_type" value={formData.two_handed_damage.damage_type.name} onChange={(e) => handleNestedChange(e, 'two_handed_damage', 'damage_type.name')} />
      </label>
      <label>
        Range (Normal):
        <input type="number" name="range_normal" value={formData.range.normal} onChange={(e) => handleNestedChange(e, 'range', 'normal')} />
      </label>
      <label>
        Range (Long):
        <input type="number" name="range_long" value={formData.range.long} onChange={(e) => handleNestedChange(e, 'range', 'long')} />
      </label>
      <label>
        Throw Range (Normal):
        <input type="number" name="throw_range_normal" value={formData.throw_range.normal} onChange={(e) => handleNestedChange(e, 'throw_range', 'normal')} />
      </label>
      <label>
        Throw Range (Long):
        <input type="number" name="throw_range_long" value={formData.throw_range.long} onChange={(e) => handleNestedChange(e, 'throw_range', 'long')} />
      </label>
      <label>
        Properties:
        {formData.properties.map((property, index) => (
          <input
            key={index}
            type="text"
            value={property.name}
            onChange={(e) => handleArrayChange(e, 'properties', index, 'name')}
          />
        ))}
      </label>
      <label>
        Equipment Category:
        <input type="text" name="equipment_category" value={formData.equipment_category.name} onChange={(e) => handleNestedChange(e, 'equipment_category', 'name')} />
      </label>
      <label>
        Rarity:
        <input type="text" name="rarity" value={formData.rarity.name} onChange={(e) => handleNestedChange(e, 'rarity', 'name')} />
      </label>
      <label>
        Requires Attunement:
        <input type="checkbox" name="requires_attunement" checked={formData.requires_attunement} onChange={(e) => setFormData({ ...formData, requires_attunement: e.target.checked })} />
      </label>
      <label>
        Weight:
        <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
      </label>
      <label>
        Cost Quantity:
        <input type="number" name="cost_quantity" value={formData.cost.quantity} onChange={(e) => handleNestedChange(e, 'cost', 'quantity')} />
      </label>
      <label>
        Cost Unit:
        <input type="text" name="cost_unit" value={formData.cost.unit} onChange={(e) => handleNestedChange(e, 'cost', 'unit')} />
      </label>
      <label>
        Description:
        <input type="text" name="desc" value={formData.desc.join(', ')} onChange={(e) => setFormData({ ...formData, desc: e.target.value.split(', ') })} />
      </label>
      <label>
        Magical:
        <input type="checkbox" name="magical" checked={formData.magical} onChange={(e) => setFormData({ ...formData, magical: e.target.checked })} />
      </label>
      <label>
        Effects:
        {formData.effects.map((effect, index) => (
          <div key={index}>
            <input
              type="text"
              name="effect_name"
              value={effect.effectName}
              onChange={(e) => handleArrayChange(e, 'effects', index, 'effectName')}
            />
            <input
              type="text"
              name="effect_description"
              value={effect.effectDescription}
              onChange={(e) => handleArrayChange(e, 'effects', index, 'effectDescription')}
            />
          </div>
        ))}
      </label>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default ItemForm;