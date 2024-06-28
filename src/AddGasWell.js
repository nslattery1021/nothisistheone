import React, { useState, useEffect } from 'react';
import { TextInput, NumberInput, Button, Group, Box, Select } from '@mantine/core';

const AddGasWellForm = ({ onSubmit, landfillsID }) => {
  const [gasWellName, setGasWellName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [type, setType] = useState('');
  const [subtype, setSubtype] = useState('');

  const typeOptions = [
    { value: 'Header Monitor', label: 'Header Monitor' },
    { value: 'Smart Well', label: 'Smart Well' },
  ];

  const subtypeOptions = {
    'Header Monitor': [
      { value: 'Above Surface', label: 'Above Surface' },
      { value: 'Subsurface', label: 'Subsurface' },
      { value: 'Riser', label: 'Riser' },
    ],
    'Smart Well': [
      { value: '2" Well', label: '2" Well' },
      { value: '3" Well', label: '3" Well' },
    ],
  };

  useEffect(() => {
    // Reset subtype when type changes
    setSubtype('');
  }, [type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGasWell = { gasWellName, lat, lng, type, subtype, landfillsID };
    onSubmit(newGasWell);
    // Clear the form fields
    setGasWellName('');
    setLat('');
    setLng('');
    setType('');
    setSubtype('');
  };

  return (
    <Box sx={{ maxWidth: 400 }} mx="auto">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Gas Well Name"
          value={gasWellName}
          onChange={(e) => setGasWellName(e.target.value)}
          required
        />
        <NumberInput
          label="Latitude"
          value={lat}
          onChange={(value) => setLat(value)}
          required
          precision={6}
        />
        <NumberInput
          label="Longitude"
          value={lng}
          onChange={(value) => setLng(value)}
          required
          precision={6}
        />
        <Select
          label="Type"
          value={type}
          onChange={(value) => setType(value)}
          data={typeOptions}
          required
        />
        <Select
          label="Subtype"
          value={subtype}
          onChange={(value) => setSubtype(value)}
          data={type ? subtypeOptions[type] : []}
          disabled={!type}
          required
        />
        <Group position="right" mt="md">
          <Button type="submit">Add Gas Well</Button>
        </Group>
      </form>
    </Box>
  );
};

export default AddGasWellForm;
