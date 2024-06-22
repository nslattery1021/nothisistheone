// src/AddLandfill.js
import React, { useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { createLandfills } from './graphql/mutations';

const AddLandfill = () => {
  const [landfill, setLandfill] = useState({
    name: '',
    address: '',
    state: '',
    city: '',
    zip: '',
    lat: '',
    lng: '',
    active: false,
  });
  const client = generateClient();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLandfill({
      ...landfill,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.graphql({
        query: createLandfills,
        variables: { input: landfill }
      }
        );
      alert('Landfill added successfully!');
    } catch (error) {
      console.error('Error adding landfill:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={landfill.name} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={landfill.address} onChange={handleChange} required />
      <input name="state" placeholder="State" value={landfill.state} onChange={handleChange} required />
      <input name="city" placeholder="City" value={landfill.city} onChange={handleChange} required />
      <input name="zip" placeholder="Zip" value={landfill.zip} onChange={handleChange} required />
      <input name="lat" placeholder="Latitude" type="number" step="0.01" value={landfill.lat} onChange={handleChange} required />
      <input name="lng" placeholder="Longitude" type="number" step="0.01" value={landfill.lng} onChange={handleChange} required />
      <label>
        Active
        <input name="active" type="checkbox" checked={landfill.active} onChange={handleChange} />
      </label>
      <button type="submit">Add Landfill</button>
    </form>
  );
};

export default AddLandfill;
