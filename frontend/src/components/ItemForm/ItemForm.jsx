import React, { useState, useEffect } from 'react';

const ItemForm = ({ item, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    category_range: '',
    damage: { damage_dice: '', damage_type: { name: '' } },
    two_handed_damage: { damage_dice: '', damage_type: { name: '' } },
    range: { normal: '', long: '' },
    throw_range: { normal: '', long: '' },
    properties: [{ name: '' }],
    equipment_category: { name: '' },
    rarity: '', 
    requires_attunement: false,
    weight: '',
    cost: { quantity: '', unit: '' },
    desc: [], 
    magical: false,
    effects: [{ effectName: '', effectDescription: '' }]
  });

  useEffect(() => {
    console.log('Form data before rendering:', formData);
  }, [formData]);  

  useEffect(() => {
    if (item) {
      const equipment = item.equipmentId || {};
      const initializedItem = {
        ...item,
        name: equipment.name || '',
        category_range: equipment.category_range || '',
        damage: equipment.damage || { damage_dice: '', damage_type: { name: '' } },
        two_handed_damage: equipment.two_handed_damage || { damage_dice: '', damage_type: { name: '' } },
        range: equipment.range || { normal: '', long: '' },
        throw_range: equipment.throw_range || { normal: '', long: '' },
        properties: equipment.properties && equipment.properties.length ? equipment.properties : [{ name: '' }],
        equipment_category: equipment.equipment_category || { name: '' },
        cost: equipment.cost || { quantity: '', unit: '' },
        desc: Array.isArray(equipment.desc) ? equipment.desc : [], // Ensure desc is an array
        effects: equipment.effects && equipment.effects.length ? equipment.effects : [{ effectName: '', effectDescription: '' }],
        requires_attunement: equipment.requires_attunement || false,
        weight: equipment.weight || '',
        rarity: equipment.rarity || ''
      };
      console.log('Initialized Item:', initializedItem); // Log the initialized item
      setFormData(initializedItem);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('handleChange - Name:', name, 'Value:', value); // Log changes
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (e, field, nestedField) => {
    const { value } = e.target;
    console.log('handleNestedChange - Field:', field, 'Nested Field:', nestedField, 'Value:', value); // Log nested changes
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
    console.log('handleArrayChange - Field:', field, 'Index:', index, 'Nested Field:', nestedField, 'Value:', value); // Log array changes
    const updatedArray = formData[field].map((item, i) => (
      i === index ? { ...item, [nestedField]: value } : item
    ));
    setFormData({ ...formData, [field]: updatedArray });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data on Submit:', formData); // Log form data on submit
    onSubmit(formData);
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
          required
          placeholder="e.g., Longsword"
        />
      </label>
      <label>
        Category Range:
        <input
          type="text"
          name="category_range"
          value={formData.category_range || ''}
          onChange={handleChange}
          placeholder="e.g., Martial Melee"
        />
      </label>
      <label>
        Damage Dice:
        <input
          type="text"
          name="damage_dice"
          value={formData.damage?.damage_dice || ''}
          onChange={(e) => handleNestedChange(e, 'damage', 'damage_dice')}
          placeholder="e.g., 1d8"
        />
      </label>
      <label>
        Damage Type:
        <input
          type="text"
          name="damage_type"
          value={formData.damage?.damage_type?.name || ''}
          onChange={(e) => handleNestedChange(e, 'damage', 'damage_type.name')}
          placeholder="e.g., Slashing"
        />
      </label>
      <label>
        Two-Handed Damage Dice:
        <input
          type="text"
          name="two_handed_damage_dice"
          value={formData.two_handed_damage?.damage_dice || ''}
          onChange={(e) => handleNestedChange(e, 'two_handed_damage', 'damage_dice')}
          placeholder="e.g., 1d10"
        />
      </label>
      <label>
        Two-Handed Damage Type:
        <input
          type="text"
          name="two_handed_damage_type"
          value={formData.two_handed_damage?.damage_type?.name || ''}
          onChange={(e) => handleNestedChange(e, 'two_handed_damage', 'damage_type.name')}
          placeholder="e.g., Slashing"
        />
      </label>
      <label>
        Range (Normal):
        <input
          type="number"
          name="range_normal"
          value={formData.range?.normal !== null ? formData.range.normal : ''}
          onChange={(e) => handleNestedChange(e, 'range', 'normal')}
          placeholder="e.g., 5"
        />
      </label>
      <label>
        Range (Long):
        <input
          type="number"
          name="range_long"
          value={formData.range?.long !== null ? formData.range.long : ''}
          onChange={(e) => handleNestedChange(e, 'range', 'long')}
          placeholder="e.g., 20"
        />
      </label>
      <label>
        Throw Range (Normal):
        <input
          type="number"
          name="throw_range_normal"
          value={formData.throw_range?.normal !== null ? formData.throw_range.normal : ''}
          onChange={(e) => handleNestedChange(e, 'throw_range', 'normal')}
          placeholder="e.g., 20"
        />
      </label>
      <label>
        Throw Range (Long):
        <input
          type="number"
          name="throw_range_long"
          value={formData.throw_range?.long !== null ? formData.throw_range.long : ''}
          onChange={(e) => handleNestedChange(e, 'throw_range', 'long')}
          placeholder="e.g., 60"
        />
      </label>
      <label>
        Properties:
        {formData.properties.map((property, index) => (
          <input
            key={index}
            type="text"
            value={property.name || ''}
            onChange={(e) => handleArrayChange(e, 'properties', index, 'name')}
            placeholder="e.g., Versatile"
          />
        ))}
      </label>
      <label>
        Equipment Category:
        <input
          type="text"
          name="equipment_category"
          value={formData.equipment_category?.name || ''}
          onChange={(e) => handleNestedChange(e, 'equipment_category', 'name')}
          placeholder="e.g., Weapon"
        />
      </label>
      <label>
        Rarity:
        <input
          type="text"
          name="rarity"
          value={formData.rarity || ''}
          onChange={handleChange}
          placeholder="e.g., Uncommon"
        />
      </label>
      <label>
        Requires Attunement:
        <input
          type="checkbox"
          name="requires_attunement"
          checked={formData.requires_attunement || false}
          onChange={(e) => setFormData({ ...formData, requires_attunement: e.target.checked })}
        />
      </label>
      <label>
        Weight:
        <input
          type="number"
          name="weight"
          value={formData.weight !== null ? formData.weight : ''}
          onChange={handleChange}
          placeholder="e.g., 3"
        />
      </label>
      <label>
        Cost Quantity:
        <input
          type="number"
          name="cost_quantity"
          value={formData.cost?.quantity !== null ? formData.cost.quantity : ''}
          onChange={(e) => handleNestedChange(e, 'cost', 'quantity')}
          placeholder="e.g., 15"
        />
      </label>
      <label>
        Cost Unit:
        <input
          type="text"
          name="cost_unit"
          value={formData.cost?.unit || ''}
          onChange={(e) => handleNestedChange(e, 'cost', 'unit')}
          placeholder="e.g., gp"
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          name="desc"
          value={Array.isArray(formData.desc) ? formData.desc.join(', ') : ''}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value.split(', ') })}
          placeholder="e.g., An arcane focus is a special item..."
        />
      </label>
      <label>
        Magical:
        <input
          type="checkbox"
          name="magical"
          checked={formData.magical || false}
          onChange={(e) => setFormData({ ...formData, magical: e.target.checked })}
        />
      </label>
      <label>
        Effects:
        {formData.effects.map((effect, index) => (
          <div key={index}>
            <input
              type="text"
              name="effect_name"
              value={effect.effectName || ''}
              onChange={(e) => handleArrayChange(e, 'effects', index, 'effectName')}
              placeholder="e.g., Fire Resistance"
            />
            <input
              type="text"
              name="effect_description"
              value={effect.effectDescription || ''}
              onChange={(e) => handleArrayChange(e, 'effects', index, 'effectDescription')}
              placeholder="e.g., Grants resistance to fire damage"
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